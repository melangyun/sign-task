import { Injectable, Inject } from "@nestjs/common";
import { sign } from "jsonwebtoken"
import { UserService } from "../user/user.service";
import { Payload } from "./payload.type";

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: UserService,
        ){}

    async signPayload(payload:Payload){
        const secret:string = process.env.JWT_SECRET_ACCESS;
        return sign ( payload, secret, {expiresIn: "1d"} );
    }

    async validateUser(payload:Payload){
        return await this.userService.findByPayload(payload);
    }

}