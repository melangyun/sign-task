import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Signup } from "../../types/user.type";
import { RegisterDTO , LoginDTO } from "../auth/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){}
    
    private sanitizeUser( user : User ){
        const { password , refreshToken , ... result } = user;
        return result;
    }

    async create(userDTO:RegisterDTO) {
        const { id } = userDTO;
        const user = await this.userRepository.findOne({id});
        if(user) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }

        const registerUser = await this.userRepository.save( userDTO );
        return this.sanitizeUser(registerUser);
    }

    async findByLogin(userDTO:LoginDTO) {
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


}