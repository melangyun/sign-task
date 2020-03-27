import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy"
import { UserService } from "../user/user.service";

@Module({
    imports:[
        UserModule, 
        PassportModule,
        ],
    controllers:[AuthController],
    providers:[ UserService, AuthService, JwtStrategy ]
})
export class AuthModule {}