import { Controller, Get, Post, UseInterceptors, UploadedFile, Delete, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ApiFile } from 'src/utilities/apiFile.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
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
  uploadFile( @UploadedFile() file ){
      // 파일 업로드, 사진 Path전송
      return file.path; 
  }

  @ApiTags("file")
  @Delete("/file")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async seeUploadedFile(@Body()body:DeleteFileDTO){
    // 전송받은 사진 삭제
      return await fs.unlinkSync(body.filepath);
  }
  
}
