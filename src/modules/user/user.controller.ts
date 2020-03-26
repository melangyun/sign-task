import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { Signup } from "./user.type";

import { signupSchema } from "./user.schema";

@Controller("user")
export class UserController{
    constructor(private readonly userService : UserService){}

    @Post()
    public async Signup ( @Body() signup : Signup ){
        try{
        const value : Signup = await signupSchema.validateAsync(signup);
        console.log('value : ', value);
         } catch(err) {
             console.log(err)
         }
        // console.log('error : ', error);
    }
}