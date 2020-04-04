import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RegisterDTO, LoginDTO } from "../src/modules/auth/auth.dto";
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestModule } from './test.module';

describe('AUTH', () => {

  let app : INestApplication;
  
  beforeAll( async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule]
    })
    .compile();
  
    app = module.createNestApplication();
    await app.init();

  });

  afterAll(async () => {
    await app.close();
  });

  const user: RegisterDTO = { id : "testuser", nickname:"test01", password : "1234"};

  describe("/auth/register (POST)", () => {
  // 회원가입
    it('should register', () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(user)
        .expect(({body})=> {
          expect(body.id).toEqual("testuser");
          expect(body.nickname).toEqual("test01");
          expect(body.password).toBeUndefined();
        })
        .expect(HttpStatus.CREATED);
    });
  
  // 회원가입 시 중복된 회원은 거절!
    it('should reject duplicate registration', () => {
      return request(app.getHttpServer())
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(user)
      .expect(({body})=> {
        expect(body.message).toEqual("User already exists");
      })
      .expect(HttpStatus.BAD_REQUEST);
    });
    
  })
  
  describe("/auth/login (POST)", () => {
// 로그인 -> 토큰을 발급받음
    it("should login" , () => {
      const user : LoginDTO = { id : "testuser" , password : "1234" }
      return request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(user)
        .expect(({body})=> {
          expect(body.token).toBeDefined();
          expect(body.payload.id).toEqual("testuser");
          expect(body.payload.nickname).toEqual("test01");
          expect(body.payload.password).toBeUndefined();
       })
       .expect(HttpStatus.CREATED)
      });

      // 로그인 -> 아이디 또는 비밀번호를 틀렸을 때
    it("should not login" , () => {
      const user : LoginDTO = { id : "testuser" , password : "01234" }
      return request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(user)
        .expect(({body})=> {
          expect(body.token).toBeUndefined();
          expect(body.message).toEqual("Invalid credential");
          expect(body.nickname).toBeUndefined();
          expect(body.id).toBeUndefined();
          expect(body.password).toBeUndefined();
       })
       .expect(HttpStatus.UNAUTHORIZED)
      });
    
  })
});