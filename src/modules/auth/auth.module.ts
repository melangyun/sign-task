import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[ UserModule, 
        PassportModule,
        JwtModule.register({
        secret:process.env.JWT_SECRET_ACCESS,
        signOptions:{ expiresIn : "1d" }
    }) ],
    controllers:[AuthController],
    providers:[AuthService, LocalStrategy]
})
export class AuthModule {}