import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, Like } from "typeorm";
import { RegisterDTO , LoginDTO } from "../auth/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){}
    
    // 유저 비밀번호 삭제
    private sanitizeUser( user : User ) : User {
        delete user.password;
        delete user.isActive;
        return user;
    }

    // 비밀번호 암호화
    private encryptToHash (pw:string):Promise<string>{
        return bcrypt.hash(pw, 10);
    }

    // 유저 생성
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

    // 로그인
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

    // 검색어로 아이디, 닉네임 검색
    async serchUser(search:string):Promise<User[]>{
        const searchKey = `%${search}%`;
        return await this.userRepository.find({
            select : ["id", "nickname"] ,
            where : [
                { id : Like (searchKey), isActive: true},
                { nickname : Like (searchKey), isActive: true}
        ]});
    }

    // 유저 확인 :  1. 아이디 검사 2. 탈퇴 유저인지 검사 
    async verifyUser(id:string){
        const user:User = await this.userRepository.findOne({id});

        if( !user ){
            throw new HttpException("Invalid user", HttpStatus.BAD_REQUEST);
        }
        
        if( !user.isActive ){
            throw new HttpException('Unable to access deleted member.', HttpStatus.NOT_ACCEPTABLE );
        }
        
        return this.sanitizeUser(user);
    }
}