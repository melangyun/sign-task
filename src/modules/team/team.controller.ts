import { Controller, Post, UseGuards, Body, Delete, Get, Param, Patch } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO, TeamUserDTO, ModifyPermissionDTO } from "./team.dto";
import { AuthUser } from "../../utilities/user.decorator";
import {ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import { LeaderGuard } from "../../guards/leader.guard";
import { User } from "../user/user.entity";
import { Team } from "./team.entity";
import { TeamUser } from "./teamuser.entity";


@ApiTags("team")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("team")
export class TeamController{
    constructor(
        private readonly teamService : TeamService,
        ){}

    
    @Get("/:teamId")
    @ApiResponse({status:200, description: "Team Information Lookup" })
    @ApiResponse({status:403, description: "have no authority to approach"})
    @ApiResponse({status:404, description: "Invalid memberId or team"})
    async getTeamInfo(@Param("teamId") teamId:number,  @AuthUser() authUser:User ):Promise<Team>{
    //팀 정보 조회
        const result:Team = await this.teamService.verifyTeam(teamId);

        await this.teamService.getTeamUser(teamId, authUser.id)
        
        return result;
    }

    
    @Get()
    @ApiResponse({status:200, description:"Successfully retrieving team lists"})
    async getMyTeamList(@AuthUser() authUser:User):Promise<{teamsByLeader:Team[], teamsByMember:Team[]}>{
        // 내가 속한 팀 전체 조회
        const { id } = authUser;
        const teamsByLeader:Team[] = await this.teamService.findAllMyTeam(id);
        const teamsByMember:Team[] = await this.teamService.findAllJoinTeam(id);
        return { teamsByLeader, teamsByMember };
    }
    
    
    @Post()
    @ApiResponse({status:201, description: "Team creation success"})
    async createTeam(@Body() createTeamDTO: CreateTeamDTO, @AuthUser() authUser:User):Promise<object>{
        // 팀생성
        const teamId:number = await this.teamService.create(createTeamDTO.name, authUser.id);

        return { teamId, leader : authUser.nickname };
    }

    @Delete()
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team delete success"})
    @ApiResponse({status:404, description: "Unable to access Invalid team."})
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO):Promise<{result:string}>{
        // 팀 삭제
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Get("/:teamId/user")
    @ApiResponse({status:200, description: "Successfully called up team member list"})
    @ApiResponse({status:403, description: "have no authority to approach"})
    @ApiResponse({status:404, description: "Unable to access Invalid team."})
    async getUsers(@Param("teamId") teamId: number,  @AuthUser() authUser:User ):Promise<TeamUser[]>{
        // 팀 맴버 조회
        const { id } = authUser;
        await this.teamService.verifyTeam( teamId );
        await this.teamService.getTeamUser( teamId, id );
        return await this.teamService.getUsers(teamId);
    }

    @Post("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:201, description: "User add success"})
    @ApiResponse({status:403, description: "have no authority to approach"})
    @ApiResponse({status:404, description: "Unable to access Invalid team."})
    async addUser(@Body() addUserDTO : TeamUserDTO):Promise<string>{
        // 팀 맴버 추가
        const { teamId , memberId } = addUserDTO;
        
        const team:Team = await this.teamService.verifyTeam(teamId);
        const user:User = await this.teamService.verifyUser(memberId);

        await this.teamService.addUser(team, user);

        return "User Added Successfully";
    }

    @Patch("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Privilege modification succeeded"})
    @ApiResponse({status:404, description: "Invalid user"})
    async modifyPermissions(@Body() modifyPermissionDTO: ModifyPermissionDTO):Promise<string>{
        // 팀 맴버 권한 수정
        await this.teamService.verifyUser(modifyPermissionDTO.memberId)
        await this.teamService.modifyPermissions(modifyPermissionDTO);
        return "Permission modification succeeded";
    }

    @Delete("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team member delete success"})
    @ApiResponse({status:403, description: "Can't access deleted user or team"})
    @ApiResponse({status:404, description: "Invalid memberId or team"})
    async deleteUser(@Body() deleteUserDTO : TeamUserDTO):Promise<string>{
        // 팀 맴버 삭제
        const { teamId, memberId } = deleteUserDTO;
        const team = await this.teamService.verifyTeam(teamId);
        const user = await this.teamService.verifyUser(memberId);
        await this.teamService.deleteUser(memberId, team, user);
        return "Team member delete success";
    }

    @Get("/:teamId/user/auth")
    @ApiResponse({status:200, description: "Privilege Lookup Successful"})
    @ApiResponse({status:403, description: "Not on the team"})
    async getMyAuth(@Param("teamId") teamId: number, @AuthUser() authUser: User ):Promise<TeamUser>{
        // 내 권한 조회
        return await this.teamService.getTeamUser(teamId, authUser.id);
    }

}