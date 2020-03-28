import { Controller, Post, UseGuards, Body, Delete, Get, Param, HttpException, HttpStatus, Request } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO, AddUserDTO } from "./team.dto";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { Team } from "./team.entity";
import { Payload } from "../auth/payload.type";
import { AuthUser } from "src/utilities/user.decorator";

@Controller("team")
@UseGuards(AuthGuard('jwt'))
export class TeamController{
    constructor(
        private readonly teamService : TeamService,
        private readonly userService: UserService
        ){}

    @Post()
    async createTeam(@Body() createTeamDTO: CreateTeamDTO){
        const teamId:number = await this.teamService.create(createTeamDTO);
        const user:User = await this.userService.findById(createTeamDTO.id);
        return { teamId, leader : user.nickname };
    }

    @Delete()
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO){
        const result:string = await this.teamService.deleteTeam(deleteTeamDTO);
        return { result };
    }
    
    @Post("/user")
    async addUser(@Body() addUserDTO : AddUserDTO, @AuthUser() user:Payload){
        const { teamId, memberId } = addUserDTO;
        console.log("user : ",user);
        const team:Team = await this.teamService.findbyId(teamId);
        if ( team.leader !== user.id ){
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED );
        }
        await this.teamService.addUser(memberId, team);
    }

}