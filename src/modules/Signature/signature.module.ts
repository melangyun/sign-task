import { Module } from "@nestjs/common";
import { SignatureController } from "./signature.controller";
import { SignatureService } from "./signature.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { TeamModule } from "../team/team.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Signature]),
        // TeamModule
    ],
    controllers:[SignatureController],
    providers:[SignatureService],
    exports:[TypeOrmModule]
})
export class SignatureModule {}