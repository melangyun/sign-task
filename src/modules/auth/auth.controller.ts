import { Controller, Post, UseGuards, Request, Get, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { RegisterDTO , LoginDTO } from "./auth.dto";

@Controller("auth")
export class AuthController{
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ){}

    @Post("login")
    async login( @Body() userDTO : LoginDTO){
        return await this.userService.findByLogin(userDTO);
    }

    @Post("register")
    async register( @Body() userDTO : RegisterDTO){
        return await this.userService.create(userDTO)
    }
}