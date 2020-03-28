import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@ApiHeader({
    name: 'Authorization',
    description: '`Bearer ${Token}`',
  })
@ApiBearerAuth()
@Controller("user")
@UseGuards(AuthGuard('jwt'))
export class UserController{
    constructor(private readonly userService : UserService){}

    @Get("/:search")
    async serchUser(@Param("search") search:string):Promise<Array<User>>{
        return await this.userService.serchUser(search);
    }

}