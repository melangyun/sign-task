import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { Login } from "../../types/user.type";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}

    public async validateUser(login:Login){
        const user = await this.userService.findOne(login.id);
        if (user && user.password === login.password ) {
            const { password, ...result } = user;
            return result;
          }
          return null;
    }

}