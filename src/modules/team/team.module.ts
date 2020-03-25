import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TeamUser } from "./teamuser.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Team, TeamUser])],
    controllers : [TeamController],
    providers : [TeamService],
    exports : [TypeOrmModule]
})
export class TeamModule {}