import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./jwt.strategy"
import { SharedModule } from "../shared/shared.module";

@Module({
    imports:[UserModule, SharedModule],
    controllers:[AuthController],
    providers:[ AuthService, JwtStrategy ]
})
export class AuthModule {}