import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterDTO , LoginDTO } from "../auth/auth.dto";
import * as bcrypt from "bcrypt";
import { Payload } from "../auth/payload.type";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){}
    
    private sanitizeUser( user : User ) : User {
        delete user.password;
        return user;
    }

    private encryptToHash (pw:string):Promise<string>{
        return bcrypt.hash(pw, 10);
    }

    async create(userDTO:RegisterDTO): Promise<User> {
        const { id, password, nickname } = userDTO;
        const user = await this.userRepository.findOne({id});
        if(user) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        const hashedPw = await this.encryptToHash(password);
        const registerUser: User = await this.userRepository.save( { id, password : hashedPw , nickname } );
        return this.sanitizeUser(registerUser);
    }

    async findByLogin(userDTO:LoginDTO): Promise<User> {
        const { id, password } = userDTO;
        const user = await this.userRepository.findOne({id});
        if(!user){
            throw new HttpException("Invalid credentails", HttpStatus.UNAUTHORIZED );
        }

        if ( await bcrypt.compare(password, user.password)){
            return this.sanitizeUser(user);
        }

        throw new HttpException("Invalid credentails", HttpStatus.UNAUTHORIZED );
    }

    async findById(id : string):Promise<User>{;
        return await this.userRepository.findOne({id});
    }

}