import { Module } from "@nestjs/common";
import { SignatureController } from "./signature.controller";
import { SignatureService } from "./signature.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Signature])],
    controllers:[SignatureController],
    providers:[SignatureService],
    exports:[TypeOrmModule]
})
export class SignatureModule {}