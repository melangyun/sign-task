import { Injectable, Inject } from "@nestjs/common";
import { sign } from "jsonwebtoken"
import { UserService } from "../user/user.service";
import { Payload } from "./payload.type";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: UserService,
        ){}
    
    // JWT 발급
    async signPayload(payload:Payload){
        const secret:string = process.env.JWT_SECRET_ACCESS;
        return sign ( payload, secret, {expiresIn: "1d"} );
    }

    // 유저 확인
    async validateUser({id}):Promise<User>{
        return await this.userService.verifyUser(id);
    }

}