import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";


@Controller("user")
export class UserController{
    constructor(private readonly userService : UserService){}

    @Get("/:search")
    async serchUser(@Param("search") search:string):Promise<Array<User>>{
        return await this.userService.serchUser(search);
    }

}