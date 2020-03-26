import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Signup } from "../../types/user.type";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){}

    public async addUser(signup: Signup){
        const {id, nickname, password } = signup;
        const registerUser = await this.userRepository.save( {id, nickname,password});
        return registerUser;
    }

    public async findOne(id:string) {
        const user = await this.userRepository.findOne({id});
        return user;
    }
}