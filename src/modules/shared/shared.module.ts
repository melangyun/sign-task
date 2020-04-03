import { Module, HttpException } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./logging.interceptor";

@Module({
    providers:[
        {provide : APP_FILTER, useClass : HttpException},
        {provide : APP_INTERCEPTOR, useClass : LoggingInterceptor}
    ]
})
export class SharedModule{}