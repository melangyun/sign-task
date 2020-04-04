import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TeamUser } from "./teamuser.entity";
import { SharedModule } from "../shared/shared.module";
import { UserModule } from "../user/user.module";

@Module({
    imports : [
        TypeOrmModule.forFeature([Team, TeamUser]), 
        SharedModule,
        UserModule
    ],
    controllers : [TeamController],
    providers : [TeamService],
    exports : [TeamService]
})
export class TeamModule {}