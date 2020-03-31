import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';

describe('team', () => {

  let app:INestApplication;
  let accessToken:string;

  const register: RegisterDTO[] = [
    { id : "testuser", nickname:"test01", password : "1234"},
    { id : "testuser2", nickname:"test02", password : "1234"},
  ];
  const login : LoginDTO = { id : "testuser" , password : "1234" }

  beforeAll( async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule]
    })
    .compile();
  
    app = module.createNestApplication();
    await app.init();

    // 회원가입 (2명)
    for( let i = 0 ; i < register.length; i++){
      await request(app.getHttpServer())
          .post("/auth/register")
          .set("Accept", "application/json")
          .send(register[i])
    }

    // 토큰 받아옴!
    await request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(login)
        .then(({body}) => {
            accessToken = body.token;
        })


  });

  afterAll(async () => {
    await app.close();
  });

  describe( "/team (GET)" ,() => {
    
  });

  describe( "/team (POST)" ,() => {

  });

  describe( "/team (DELETE)" ,() => {

  });

  describe( "/team/user (GET)" ,() => {

  });

  describe( "/team/user (POST)" ,() => {

  });

  describe( "/team/user (PATCH)" ,() => {

  });

  describe( "/team/user (DELETE)" ,() => {

  });

  describe( "/team/user/auth/{teamId} (GET)" ,() => {

  });

});