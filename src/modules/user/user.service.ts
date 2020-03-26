import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Signup } from "./user.type";

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
}