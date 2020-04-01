import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';

describe('SIGNATURE', () => {

  let app:INestApplication;
  let accessToken:string;

  const register: RegisterDTO = { id : "testuser", nickname:"test01", password : "1234"};
  const login : LoginDTO = { id : "testuser" , password : "1234" }
  beforeAll( async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule]
    })
    .compile();
  
    app = module.createNestApplication();
    await app.init();

    // 회원가입
    await request(app.getHttpServer())
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(register)

    // 토큰 받아서 설정
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

  // 서명 생성
  describe( "/signature (POST)" ,() => {
    
  });

  // 서명 삭제
  describe( "/signature (DELETE)" ,() => {
   
  });

  // 개인 서명을 가지고 옴
  describe( "/signature/user (GET)" ,() => {
   
  });

  // 팀 서명 조회
  describe( "/signature/team/{teamId} (GET)" ,() => {
   
  });

  // 서명 아이디로 조회
  describe( "/signature/signature/{signId} (GET)" ,() => {
   
  });
});