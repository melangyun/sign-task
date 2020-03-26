import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SignatureModule } from "../Signature/signature.module";
import { TeamModule } from "../team/team.module";
import { Connection } from 'typeorm';
// import { ConfigModule } from '@nestjs/config';
// import * as Joi from '@hapi/joi';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     NODE_ENV: Joi.string()
    //       .valid('development', 'production', 'test', 'provision')
    //       .default('development'),
    //     PORT: Joi.number().default(3000),
    //   }),
    //   validationOptions: {
    //     allowUnknown: false,
    //     abortEarly: true,
    //   },
    // }),
    TypeOrmModule.forRoot(),
    UserModule,
    SignatureModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports : [ConfigModule]
})
export class AppModule {
  constructor(private connection: Connection) {}
}
