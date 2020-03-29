import { Controller, UseGuards, Post, UseInterceptors, UploadedFile, Get, Res, Param, Body } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SignatureService } from "./signature.service";
import { ApiBearerAuth, ApiTags, ApiConsumes } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/utilities/user.decorator";
import { multerOptions } from "./multer.config";
import { SignDTO } from "./signature.dto";
import { User } from "../user/user.entity";
import { ApiFile } from "../../utilities/apiFile.decorator";
import * as fs from "fs";

@ApiTags("signature")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}

    @Post("/file")
    @ApiConsumes('multipart/form-data')
    @ApiFile()
    @UseInterceptors(FileInterceptor("file", multerOptions))
    uploadFile( @UploadedFile() file ){
        return file.path; 
    }

    @Get(":imgpath")
    async seeUploadedFile(@Param("imgpath") image:string){
        const result = await fs.unlinkSync(image);
        return result;
    }
}