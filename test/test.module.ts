import { Module } from '@nestjs/common';
import { AppController } from '../src/modules/main/app.controller';
import { AppService } from '../src/modules/main/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/modules/user/user.module';
import { SignatureModule } from "../src/modules/Signature/signature.module";
import { TeamModule } from "../src/modules/team/team.module";
import { Connection } from 'typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath:".dev.env"}),
    TypeOrmModule.forRoot(),
    UserModule,
    SignatureModule,
    TeamModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestModule {
  constructor(private connection: Connection) {}
}
