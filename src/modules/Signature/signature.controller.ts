import { Controller, UseGuards, Post, Body, Delete, Get, Param } from "@nestjs/common";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags,  } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/utilities/user.decorator";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { User } from "../user/user.entity";
import { Signature } from "./signature.entity";



@ApiTags("signature")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}

    @Post()
    async addSignature( @Body() signDTO:SignDTO, @AuthUser() authUser:User):Promise<Signature>{
        //서명 등록
        return await this.signatureService.create(signDTO, authUser.id);
    }

    @Get("/:sign")
    async getSignatures(@Param("signId") signId:string):Promise<Signature>{
        return await this.signatureService.findBySignId(signId);
    }

    @Delete()
    async deleteSignature(@Body() deletesignDTO :DeleteSignDTO, @AuthUser() authUser:User){
        // 서명 삭제
    }

}