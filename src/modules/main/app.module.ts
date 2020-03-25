import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SignatureModule } from "../Signature/signature.module";
import { TeamModule } from "../Team/team.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    SignatureModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
