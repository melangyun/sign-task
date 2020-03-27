import { Module, HttpException } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
    providers:[
        {provide : APP_FILTER, useClass : HttpException}
    ]
})
export class SharedModule{}