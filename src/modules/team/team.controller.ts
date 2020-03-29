import { Controller, Post, UseGuards, Body, Delete, Get, Param, HttpException, HttpStatus, Request, Patch } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO, TeamUserDTO, ModifyPermissionDTO } from "./team.dto";
import { AuthUser } from "src/utilities/user.decorator";
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

    
    @Get()
    @ApiResponse({status:200, description:"Successfully retrieving team lists"})
    async getMyTeamList(@AuthUser() authUser:User):Promise<{teamsByLeader:Team[], teamsByMember:Team[]}>{
        // 내가 속한 팀 전체 조회
        const { id } = authUser;
        const teamsByLeader:Team[] = await this.teamService.findAllmyTeam(id);
        const teamsByMember:Team[] = await this.teamService.findAllJoinTeam(id);
        return { teamsByLeader, teamsByMember };
    }
    
    
    @Post()
    @ApiResponse({status:201, description: "Team creation success"})
    async createTeam(@Body() createTeamDTO: CreateTeamDTO, @AuthUser() authUser:User){
        // 팀생성
        const teamId:number = await this.teamService.create(createTeamDTO.name, authUser.id);
        await this.teamService.addUser({teamId ,memberId : authUser.id});
        return { teamId, leader : authUser.nickname };
    }

    @Delete()
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team delete success"})
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO):Promise<{result:string}>{
        // 팀 삭제
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Get("/user/:teamId")
    @ApiResponse({status:200, description: "Successfully called up team member list"})
    async getUsers(@Param("teamId") teamId: number ):Promise<TeamUser[]>{
        // 팀 맴버 조회
        return await this.teamService.getUsers(teamId);
    }

    @Post("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "User add success"})
    @ApiResponse({status:400, description: "Invalid memberId"})
    async addUser(@Body() addUserDTO : TeamUserDTO){
        // 팀 맴버 추가
        await this.teamService.addUser(addUserDTO);
        return "User Added Successfully";
    }

    @Patch("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:400, description: "Invalid memberId"})
    async modifyPermissions(@Body() modifyPermissionDTO: ModifyPermissionDTO){
        // 팀 맴버 권한 수정
        await this.teamService.modifyPermissions(modifyPermissionDTO);
    }

    @Delete("/user")
    @UseGuards(LeaderGuard)
    async deleteUser(@Body() deleteUserDTO : TeamUserDTO){
        // 팀 맴버 삭제
        await this.teamService.deleteUser(deleteUserDTO);
    }

    @Get("/user/auth")
    async getMyAuth(@Param("teamId") teamId: number, @AuthUser() authUser: User ):Promise<TeamUser>{
        // 내 권한 조회
        return await this.teamService.getTeamUser(teamId, authUser.id);
    }

}