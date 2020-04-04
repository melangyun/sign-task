import { Controller, Get, Post, UseInterceptors, UploadedFile, Delete, UseGuards, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ApiFile } from '../utilities/apiFile.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utilities/multer.config';
import * as fs from "fs";
import { AuthGuard } from '@nestjs/passport';
import { DeleteFileDTO } from "./app.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @ApiTags("root")
  @Get()
  @ApiResponse({ status: 200, description: "Hello World!"})
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags("file")
  @Post("/file")
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({status:201, description:"Photo upload Success"})
  @ApiResponse({status:400, description:"Unsupported file type"})
  uploadFile( @UploadedFile() file ){
      // 파일 업로드, 사진 Path전송
      const { filename } = file;
      return { filename }; 
  }

  @ApiTags("file")
  @Delete("/file")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({status:200, description:"Photo delete Success"})
  @ApiResponse({status:400, description:"Not exist file"})
  async seeUploadedFile(@Body()body:DeleteFileDTO){
    // 전송받은 사진 삭제
    try {
      fs.unlinkSync(`uploads/${body.filename}`)
      return "delete File Success";
    } catch(e){
      throw new HttpException("File not exist", HttpStatus.BAD_REQUEST);
    }
      
  }
  
}
