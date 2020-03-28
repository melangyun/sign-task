import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository, UpdateResult } from "typeorm";
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
    
    async deleteTeam(deleteTeamDTo : DeleteTeamDTO): Promise<string> {
        const { teamId } = deleteTeamDTo;
        const result:UpdateResult = await this.teamRepository.update(teamId , {isActive : false}) ;
        if (!result.raw.changedRows) {
            throw new HttpException("Invalid teamId", HttpStatus.BAD_REQUEST);
        }

        return result.raw.message;
    }

    async findbyId( id : number) : Promise<Team>{
        const team:Team = await this.teamRepository.findOne({id});
        console.log(team);
        if(!team || !team.isActive ){
            throw new HttpException("Invalid teamId", HttpStatus.BAD_REQUEST);
        }

        return team;
    }

    async addUser(memberId: string, team:Team):Promise<void> {
        const addUser = new User();
        addUser.id = memberId;

        const teamUesr = new TeamUser();
        teamUesr.team = team;
        teamUesr.user = addUser;
    
        const result = await this.teamUserRepository.save(teamUesr);
        console.log(result);
    }
}