import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository } from "typeorm";
import { TeamUser } from "./teamuser.entity";

@Injectable()
export class TeamService{
    constructor(
        @InjectRepository(Team)
        private teamRepository : Repository<Team>,
        @InjectRepository(TeamUser)
        private teamUserRepository : Repository<TeamUser>
    ){}
}