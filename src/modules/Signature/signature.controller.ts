import { Controller, UseGuards, Post, Body, Delete, Get, Param } from "@nestjs/common";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags, ApiResponse,  } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "../../utilities/user.decorator";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { User } from "../user/user.entity";
import { Signature } from "./signature.entity";
import { signatureAuth } from "./signature.enum";


@ApiTags("signature")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}

    @Post()
    @ApiResponse({status:200, description:"Successfully adding Signature"})
    @ApiResponse({status:400, description:"Invalid teamId"})
    @ApiResponse({status:406, description: "Unable to access deleted team."})
    async addSignature( @Body() signDTO:SignDTO, @AuthUser() authUser:User):Promise<object>{
        //서명 등록
        const { teamId } = signDTO;

        if(teamId){
            await this.signatureService.validateUserAuth(teamId, authUser.id , signatureAuth.add );
        }

        const registeredId:string = await this.signatureService.create(signDTO, authUser.id);
        return { registeredId };
    }

    @Get("user/")
    @ApiResponse({status:200, description:"Successfully get Signature"})
    async getUserSigns(@AuthUser() authUser:User):Promise<Signature[]>{
        return await this.signatureService.getSigns(authUser.id, null);
    }
    
    @Get("team/:teamId")
    @ApiResponse({status:201, description:"Successfully get Signature"})
    @ApiResponse({status:406, description:"No Access for the team"})
    async geTeamSigns(@Param("teamId") teamId:number ,@AuthUser() authUser:User):Promise<Signature[]>{
        await this.signatureService.validateUserAuth( teamId, authUser.id, signatureAuth.lookup )
        return await this.signatureService.getSigns( authUser.id, teamId );
    }

    @Get("/:signId")
    @ApiResponse({status:200, description:"Successfully get Signature"})
    @ApiResponse({status:400, description:"Invalid signature key"})
    @ApiResponse({status:406, description:"No Access for the signature"})
    async getSignatures(@Param("signId") signId:string, @AuthUser() authUser:User):Promise<object>{
        // 서명 아이디로 서명 반환
        // ? 유저 아이디
        const { id } = authUser;
        return await this.signatureService.validateSignId(signId, id, signatureAuth.lookup);
    }

    @Delete()
    @ApiResponse({status:200, description:"Successfully delete Signature"})
    @ApiResponse({status:400, description:"Invalid signature key"})
    @ApiResponse({status:406, description:"No Access for the signature"})
    async deleteSignature(@Body() deleteSignDTO :DeleteSignDTO, @AuthUser() authUser:User):Promise<string>{
        // 서명 삭제
        const { signatureId } = deleteSignDTO;
        const { id } = authUser;
        await this.signatureService.validateSignId( signatureId, id , signatureAuth.delete);
        return await this.signatureService.delete(signatureId);
    }

}