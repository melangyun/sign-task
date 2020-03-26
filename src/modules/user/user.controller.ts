import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { Signup } from "../../types/user.type";

import { signupSchema } from "./user.schema";

@Controller("user")
export class UserController{
    constructor(private readonly userService : UserService){}

    @Post()
    public async addUser ( @Body() signup : Signup ){
        try{
            const value : Signup = await signupSchema.validateAsync(signup);
            const registerUser = await this.userService.addUser(value);
            return registerUser;
         } catch(err) {
             console.log(err)
         }
    }
}