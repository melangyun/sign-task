import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { TeamUser } from "./teamuser.entity";
import { DeleteTeamDTO, TeamUserDTO, ModifyPermissionDTO } from "./team.dto";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class TeamService{
    constructor(
        @InjectRepository(Team)
        private teamRepository : Repository<Team>,
        @InjectRepository(TeamUser)
        private teamUserRepository : Repository<TeamUser>,
        private readonly userService: UserService,
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

    async addUser(addUserDTO : TeamUserDTO):Promise<void> {
        const { teamId, memberId } = addUserDTO;
        
        const member:User = await this.userService.findById(memberId);
        
        if( !member ){
            throw new HttpException("Invalid memberId", HttpStatus.BAD_REQUEST);
        }

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

    async findTeamByTeamId( id:number ): Promise<Team> {
        return await this.teamRepository.findOne({id});
    }

    async findAllmyTeam(id: string):Promise<Array<Team>> {
        return await this.teamRepository.find({
            select : ["id", "name", "leader"],
            where: { leader : id , isActive : true }
        });
    }

    async findAllJoinTeam(id: string):Promise<Array<Team>> {
        return await this.teamRepository.createQueryBuilder("team")
            .select(["team.id", "team.name", "team.leader"])
            .where("team.is_active = :status", {status : true})
            .leftJoin("team.teamUsers", "teamUser")
            .andWhere("teamUser.userId = :id",{id})
            .getMany();

    }

    async getUsers(id:number):Promise<Array<object>>{
        return await this.teamUserRepository.createQueryBuilder("team_user")
            .select(["team_user.auth","user.id" , "user.nickname"])
            .where("team_user.teamId = :id", { id })
            .leftJoin("team_user.user", "user")
            .andWhere("user.is_active = :status", {status : true})
            .getMany();
    }

    async deleteUser(deleteUserDTO : TeamUserDTO){
        const { teamId, memberId } = deleteUserDTO;

        const user = new User();
        user.id = memberId;
        const team = new Team()
        team.id = teamId;
        
        await this.teamUserRepository.delete({user, team});
        
    }
}