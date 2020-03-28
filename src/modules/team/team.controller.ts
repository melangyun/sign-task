import { Controller, Post, UseGuards, Body, Delete, Get, Param, HttpException, HttpStatus, Request, Patch } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO, AddUserDTO, ModifyPermissionDTO } from "./team.dto";
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
    async getMyTeamList(@AuthUser() authUser:User):Promise<{teamsByLeader:Team[], teamsByMember:Team[]}>{
        const { id } = authUser;
        const teamsByLeader:Array<Team> = await this.teamService.findAllmyTeam(id);
        const teamsByMember:Array<Team> = await this.teamService.findAllJoinTeam(id);
        return { teamsByLeader, teamsByMember };
    }
    
    
    @Post()
    @ApiResponse({status:201, description: "Team creation success"})
    async createTeam(@Body() createTeamDTO: CreateTeamDTO, @AuthUser() authUser:User){
        const teamId:number = await this.teamService.create(createTeamDTO.name, authUser.id);
        return { teamId, leader : authUser.nickname };
    }

    @Delete()
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "Team delete success"})
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO):Promise<{result:string}>{
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Get("/user/:teamId")
    async getUsers(@Param("teamId") teamId: number ):Promise<Array<object>>{
        return await this.teamService.getUsers(teamId);
    }

    @Post("/user")
    @UseGuards(LeaderGuard)
    @ApiResponse({status:200, description: "User add success"})
    async addUser(@Body() addUserDTO : AddUserDTO){
        await this.teamService.addUser(addUserDTO);
        return {};
    }


    @Patch("/user")
    @UseGuards(LeaderGuard)
    async modifyPermissions(@Body() modifyPermissionDTO: ModifyPermissionDTO){
        await this.teamService.modifyPermissions(modifyPermissionDTO);
    }

}