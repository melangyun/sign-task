import { Controller, UseGuards, Post, Body, Delete, Get } from "@nestjs/common";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags,  } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/utilities/user.decorator";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { User } from "../user/user.entity";



@ApiTags("signature")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}

    @Post()
    async addSignature( @Body() signDTO:SignDTO, @AuthUser() authUser:User){
        //서명 등록
        await this.signatureService.create(signDTO, authUser.id);
    }

    @Get("/:sign")
    async getSignatures(){
        await this.signatureService.findAll();
    }

    @Delete()
    async deleteSignature(@Body() deletesignDTO :DeleteSignDTO, @AuthUser() authUser:User){
        // 서명 삭제
    }

}