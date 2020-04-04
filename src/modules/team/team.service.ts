import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository, UpdateResult } from "typeorm";
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

    // 팀 확인 :  1. 팀 아이디 검사 2. 활성화 되어있는 팀인지 검사
    async verifyTeam(teamId:number):Promise<Team>{
        const team:Team = await this.teamRepository.findOne({id: teamId});

        if( !team ){
            throw new HttpException("Invalid teamId", HttpStatus.BAD_REQUEST);
        }

        if( !team.isActive ){
            throw new HttpException('Unable to access deleted team.', HttpStatus.NOT_ACCEPTABLE );
          }

        return team;
    }

    // 팀 생성
    async create(name:string, id:string): Promise<number> {
        const user = new User();
        user.id = id;
        
        const team = new Team();
        team.name = name;
        team.leader = id;
        team.user = user;
        
        const registeredTeam: Team  =  await this.teamRepository.save(team);
        team.id = registeredTeam.id;

        const teamUser = new TeamUser();
        teamUser.auth = {"lookup" : true, "add" : true, "delete" : true };
        teamUser.team = team;
        teamUser.user = user;

        await this.teamUserRepository.save(teamUser);

        return team.id;
    }
    
    // 팀 삭제
    async deleteTeam(deleteTeamDTO : DeleteTeamDTO): Promise<string> {
        const { teamId } = deleteTeamDTO;
        const result:UpdateResult = await this.teamRepository.update(teamId , {isActive : false}) ;
        if (!result.raw.changedRows) {
            throw new HttpException("Invalid teamId", HttpStatus.BAD_REQUEST);
        }

        return result.raw.message;
    }

    // 팀 - 유저 추가
    async addUser(addUserDTO : TeamUserDTO):Promise<void> {
        const { teamId, memberId } = addUserDTO;
        await this.userService.verifyUser(memberId);

        const addUser = new User();
        addUser.id = memberId;

        const team = new Team();
        team.id = teamId;

        const teamUser = new TeamUser();
        teamUser.team = team;
        teamUser.user = addUser;
    
        await this.teamUserRepository.save(teamUser);
    }

    // 유저 권한 수정
    async modifyPermissions(modifyPermissionDTO : ModifyPermissionDTO){
        const { teamId , memberId, auth } = modifyPermissionDTO;
        await this.userService.verifyUser(memberId);

        const team = new Team();
        team.id = teamId;

        const user = new User();
        user.id = memberId;

        const result:UpdateResult = await this.teamUserRepository.update({ team, user }, { auth })
        if(!result.raw.changedRows){
            throw new HttpException("Invalid teamMember", HttpStatus.BAD_REQUEST);
        }
    }

    // 리더로서 참가하는 팀
    async findAllmyTeam(id: string):Promise<Team[]> {
        return await this.teamRepository.find({
            select : ["id", "name", "leader"],
            where: { leader : id , isActive : true }
        });
    }

    // 참여자로서 참가하는 팀
    async findAllJoinTeam(id: string):Promise<Team[]> {
        return await this.teamRepository.createQueryBuilder("team")
            .select(["team.id", "team.name", "team.leader"])
            .where("team.is_active = :status", {status : true})
            .leftJoin("team.teamUsers", "teamUser")
            .andWhere("teamUser.userId = :id",{id})
            .getMany();

    }

    // 팀 아이디를 받아 맴버 아이디, 닉네임, 권한을 돌려줌
    async getUsers(teamId:number, userId:string):Promise<TeamUser[]>{
        await this.verifyTeam(teamId);
        await this.getTeamUser(teamId, userId)
        return await this.teamUserRepository.createQueryBuilder("team_user")
            .select(["team_user.auth","user.id" , "user.nickname"])
            .where("team_user.teamId = :id", { id : teamId })
            .leftJoin("team_user.user", "user")
            .andWhere("user.is_active = :status", {status : true})
            .getMany();
    }

    // 팀 맴버로서 유저 삭제
    async deleteUser(deleteUserDTO : TeamUserDTO){
        const { teamId, memberId } = deleteUserDTO;
        await this.userService.verifyUser(memberId);
        const team = await this.verifyTeam(teamId);

        if( team.leader === memberId ){
            throw new HttpException("Can't delete TeamLeader", HttpStatus.BAD_REQUEST );
        }

        const user = new User();
        user.id = memberId;
        
        await this.teamUserRepository.delete({user, team});   
    }

    // 유저 상세정보(권한 가입일 등) 을 리턴함
    async getTeamUser(teamId:number, userId:string):Promise<TeamUser>{
        // await this.userService.verifyUser(userId);
        await this.verifyTeam(teamId);

        const user = new User();
        user.id = userId;
        const team = new Team();
        team.id = teamId;

        const result:TeamUser = await this.teamUserRepository.findOne({user , team});
        
        if(!result){
            throw new HttpException("Not on the team", HttpStatus.BAD_REQUEST);
        }
        
        return result;
    }
}