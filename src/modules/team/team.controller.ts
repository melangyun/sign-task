import { Controller, Post, UseGuards, Body, Delete, Get, Param, HttpException, HttpStatus, Request, Patch } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO, AddUserDTO, ModifyPermissionDTO } from "./team.dto";
import { UserService } from "../user/user.service";
import { Payload } from "../auth/payload.type";
import { AuthUser } from "src/utilities/user.decorator";
import { ApiHeader } from "@nestjs/swagger";

@ApiHeader({
    name: 'Authorization',
    description: '`Bearer ${Token}`',
  })
@UseGuards(AuthGuard('jwt'))
@Controller("team")
export class TeamController{
    constructor(
        private readonly teamService : TeamService,
        private readonly userService: UserService
        ){}

    @Post()
    async createTeam(@Body() createTeamDTO: CreateTeamDTO, @AuthUser() authUser:Payload){
        const teamId:number = await this.teamService.create(createTeamDTO.name, authUser.id);
        return { teamId, leader : authUser.nickname };
    }

    @Delete()
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO){
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Post("/user")
    async addUser(@Body() addUserDTO : AddUserDTO){
        await this.teamService.addUser(addUserDTO);
        return {};
    }

    @Patch("/user")
    async modifyPermissions(@Body() modifyPermissionDTO: ModifyPermissionDTO){
        await this.teamService.modifyPermissions(modifyPermissionDTO);
    }

}