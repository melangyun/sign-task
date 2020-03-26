import { Injectable, Inject } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { Login } from "../../types/user.type";

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: UserService,
        @Inject("JwtService") private readonly jwtService : JwtService
        ){}

    public async validateUser(login:Login){
        const user = await this.userService.findOne(login.id);
        if (user && user.password === login.password ) {
            const { password, ...result } = user;
            return result;
          }
          return null;
    }

    public async login(user:User) {
        const { id, nickname } = user;
        const payload = { id, nickname };
        return { accessToken : this.jwtService.sign(payload)}
    }

}