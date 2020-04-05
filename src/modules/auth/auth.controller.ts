import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { RegisterDTO , LoginDTO } from "./auth.dto";
import { User } from "../user/user.entity";
import { Payload } from "./payload.type";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController{
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ){}

    @Post("login")
    @ApiResponse({status:201, description: "login success"})
    @ApiResponse({status:401, description : "Invalid credential"})
    async login(@Body() userDTO: LoginDTO): Promise<{payload:Payload , token:string}>{
        // 로그인
        const user : User = await this.userService.findByLogin(userDTO);
        const payload = {
            id : user.id,
            nickname : user.nickname
        }

        const token = await this.authService.signPayload(payload);
        return {payload, token};
    }

    @Post("register")
    @ApiResponse({status:201, description: "register success"})
    @ApiResponse({status:400, description : "User already exists"})
    async register( @Body() userDTO : RegisterDTO): Promise<Payload>{
        // 회원 가입
        const user:User =  await this.userService.create(userDTO)
        return { id: user.id, nickname: user.nickname };
    }
    
}