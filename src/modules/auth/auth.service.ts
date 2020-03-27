import { Injectable, Inject } from "@nestjs/common";
import { sign } from "jsonwebtoken"
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        @Inject("UserService") private readonly userService: UserService,
        ){}

    async signPayload(payload:any){
        const secret:string = process.env.JWT_SECRET_ACCESS;
        return sign ( payload, secret, {expiresIn: "1d"} );
    }

    async validateUser(payload:any){
        return await this.userService.findByPayload(payload);
    }

}