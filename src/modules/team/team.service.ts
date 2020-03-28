import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository, InsertResult } from "typeorm";
import { TeamUser } from "./teamuser.entity";
import { CreateTeamDTO, DeleteTeamDTO } from "./team.dto";
import { User } from "../user/user.entity";

@Injectable()
export class TeamService{
    constructor(
        @InjectRepository(Team)
        private teamRepository : Repository<Team>,
        @InjectRepository(TeamUser)
        private teamUserRepository : Repository<TeamUser>
    ){}
    
    async create(createTeamDTO: CreateTeamDTO): Promise<number> {
        const { id , name }:{ id: string, name: string} = createTeamDTO;
        
        const user = new User();
        user.id = createTeamDTO.id;
        
        const team = new Team();
        team.name = name;
        team.leader = id;
        team.user = user;
        
        const registedTeam: Team  =  await this.teamRepository.save(team);
        return registedTeam.id;
    }
    
    async deleteTeam(deleteTeamDTo : DeleteTeamDTO): any {
        // const result = await this.teamRepository.update() 
    }
}