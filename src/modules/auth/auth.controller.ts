import { Controller, Post, UseGuards, Get, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { RegisterDTO , LoginDTO } from "./auth.dto";
import { User } from "../user/user.entity";

@Controller("auth")
export class AuthController{
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ){}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    tempAuth(){
        return { auth : "works" };
    }

    @Post("login")
    async login(@Body() userDTO: LoginDTO): Promise<{payload:object , token:string}>{
        const user : User = await this.userService.findByLogin(userDTO);
        const payload = {
            id : user.id,
            nickname : user.nickname
        }

        const token = await this.authService.signPayload(payload);
        return {payload, token};
    }

    @Post("register")
    async register( @Body() userDTO : RegisterDTO): Promise<{id:string, nickname:string}>{
        const user:User =  await this.userService.create(userDTO)
        return { id: user.id, nickname: user.nickname };
    }
    
}