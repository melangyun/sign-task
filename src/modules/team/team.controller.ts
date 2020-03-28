import { Controller, Post, UseGuards, Body, Delete, Get } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateTeamDTO, DeleteTeamDTO } from "./team.dto";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";

@Controller("team")
export class TeamController{
    constructor(
        private readonly teamService : TeamService,
        private readonly userService: UserService
        ){}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTeam(@Body() createTeamDTO: CreateTeamDTO){
        const teamId:number = await this.teamService.create(createTeamDTO);
        const user:User = await this.userService.findById(createTeamDTO.id);
        return { teamId, leader : user.nickname };
    }

    @Delete()
    async deleteTeam(@Body() deleteTeamDTO : DeleteTeamDTO){
        const result:any = await this.teamService.deleteTeam(deleteTeamDTO);
    }
    

}