import { Controller, UseGuards, Post, Body, Delete, Get, Param } from "@nestjs/common";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags, ApiResponse,  } from "@nestjs/swagger";
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
    @ApiResponse({status:200, description:"Successfully adding Signature"})
    @ApiResponse({status:406, description: "Unable to access deleted team."})
    async addSignature( @Body() signDTO:SignDTO, @AuthUser() authUser:User):Promise<object>{
        //서명 등록
        const signId:string = await this.signatureService.create(signDTO, authUser.id);
        return { registeredId : signId };
    }

    @Get("/:signId")
    @ApiResponse({status:200, description:"Successfully get Signature"})
    @ApiResponse({status:400, description:"Invalid signature key"})
    @ApiResponse({status:406, description:"No Access for the signature"})
    async getSignatures(@Param("signId") signId:string):Promise<Signature>{
        // 서명 아이디로 서명 반환
        return await this.signatureService.findBySignId(signId);
    }

    @Delete()
    async deleteSignature(@Body() deletesignDTO :DeleteSignDTO, @AuthUser() authUser:User){
        // 서명 삭제
        return await this.signatureService.delete(deletesignDTO, authUser.id );
    }

    @Get("user/")
    async getUserSigns(@AuthUser() authUser:User):Promise<Signature[]>{
        return await this.signatureService.getUserSigns(authUser.id);
    }

    @Get("team/:teamId")
    async geTeamSigns(@Param("teamId") teamId:number ,@AuthUser() authUser:User):Promise<Signature[]>{
        return await this.signatureService.geTeamSigns( teamId, authUser.id );
    }
}