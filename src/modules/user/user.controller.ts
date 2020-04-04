import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("user")
@ApiBearerAuth()
@Controller("user")
@UseGuards(AuthGuard('jwt'))
export class UserController{
    constructor(private readonly userService : UserService){}

    @Get("/:search")
    @ApiResponse({status:200, description: "return search list"})
    async searchUser(@Param("search") search:string):Promise<User[]>{
        return await this.userService.searchUser(search);
    }

}