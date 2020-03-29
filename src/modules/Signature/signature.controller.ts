import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags,  } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/utilities/user.decorator";



@ApiTags("signature")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}

    @Post()
    async addSignature(@Body()signDto:SignDTO, @AuthUser() authUser:User){
        //서명 등록
    }

}