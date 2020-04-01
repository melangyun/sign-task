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
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async getTeamInfo(@Param("teamId") teamId:number ):Promise<Team>{
    //팀 정보 조회
        return await this.teamService.verifyTeam(teamId);
    }

    
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
    async createTeam(@Body() createTeamDTO: CreateTeamDTO, @AuthUser() authUser:User):Promise<object>{
        // 팀생성
        const teamId:number = await this.teamService.create(createTeamDTO.name, authUser.id);

        return { teamId, leader : authUser.nickname };
    }

    @Delete()
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team delete success"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO):Promise<{result:string}>{
        // 팀 삭제
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Get("/user/:teamId")
    @ApiResponse({status:200, description: "Successfully called up team member list"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async getUsers(@Param("teamId") teamId: number ):Promise<TeamUser[]>{
        // 팀 맴버 조회
        return await this.teamService.getUsers(teamId);
    }

    @Post("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "User add success"})
    @ApiResponse({status:400, description: "Invalid memberId"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async addUser(@Body() addUserDTO : TeamUserDTO):Promise<string>{
        // 팀 맴버 추가
        await this.teamService.addUser(addUserDTO);
        return "User Added Successfully";
    }

    @Patch("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Privilege modification succeeded"})
    @ApiResponse({status:400, description: "Invalid memberId or member"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async modifyPermissions(@Body() modifyPermissionDTO: ModifyPermissionDTO):Promise<string>{
        // 팀 맴버 권한 수정
        await this.teamService.modifyPermissions(modifyPermissionDTO);
        return "Permission modification succeeded";
    }

    @Delete("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team member delete success"})
    @ApiResponse({status:400, description: "Invalid memberId"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async deleteUser(@Body() deleteUserDTO : TeamUserDTO):Promise<string>{
        // 팀 맴버 삭제
        await this.teamService.deleteUser(deleteUserDTO);
        return "Team member delete success";
    }

    @Get("/user/auth/:teamId")
    @ApiResponse({status:200, description: "Privilege Lookup Successful"})
    @ApiResponse({status:400, description: "Invalid memberId"})
    @ApiResponse({status:406, description: "Unable to access Invalid team."})
    async getMyAuth(@Param("teamId") teamId: number, @AuthUser() authUser: User ):Promise<TeamUser>{
        // 내 권한 조회
        return await this.teamService.getTeamUser(teamId, authUser.id);
    }

}