import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository, UpdateResult } from "typeorm";
import { TeamUser } from "./teamuser.entity";
import { DeleteTeamDTO, AddUserDTO, ModifyPermissionDTO } from "./team.dto";
import { User } from "../user/user.entity";

@Injectable()
export class TeamService{
    constructor(
        @InjectRepository(Team)
        private teamRepository : Repository<Team>,
        @InjectRepository(TeamUser)
        private teamUserRepository : Repository<TeamUser>
    ){}
    
    async create(name:string, id:string): Promise<number> {
        const user = new User();
        user.id = id;
        
        const team = new Team();
        team.name = name;
        team.leader = id;
        team.user = user;
        
        const registedTeam: Team  =  await this.teamRepository.save(team);
        return registedTeam.id;
    }
    
    async deleteTeam(deleteTeamDTO : DeleteTeamDTO): Promise<string> {
        const { teamId } = deleteTeamDTO;
        const result:UpdateResult = await this.teamRepository.update(teamId , {isActive : false}) ;
        if (!result.raw.changedRows) {
            throw new HttpException("Invalid teamId", HttpStatus.BAD_REQUEST);
        }

        return result.raw.message;
    }

    async addUser(addUserDTO : AddUserDTO):Promise<void> {
        const { teamId, memberId } = addUserDTO;
        
        const addUser = new User();
        addUser.id = memberId;

        const team = new Team();
        team.id = teamId;

        const teamUesr = new TeamUser();
        teamUesr.team = team;
        teamUesr.user = addUser;
    
        await this.teamUserRepository.save(teamUesr);
    }

    async modifyPermissions(modifyPermissionDTO : ModifyPermissionDTO){
        const { teamId , memberId, auth } = modifyPermissionDTO;
        const user = new User();
        user.id = memberId;

        const reulst = await this.teamUserRepository.update(teamId, { auth , user })
        console.log("reulst : ",reulst);
    }
}