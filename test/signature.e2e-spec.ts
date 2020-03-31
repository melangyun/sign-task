import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';

describe('user', () => {

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

  describe( "/user/{search} (GET)" ,() => {
    // 유저 검색결과
    it('should get user search result', () => {
        const rearchKey = "test";
        return request(app.getHttpServer())
          .get(`/user/${rearchKey}`)
          .set('Authorization', `Bearer ${ accessToken }`)
          .expect(HttpStatus.OK)
          .expect(({body}) => {
            expect(body).toContainEqual({ id : register.id , nickname : register.nickname })
          })
      });

    // 토큰 없이는 받아오지 않음
    it('should not get user search result without accessToken', () => {
        const rearchKey = "test";
        return request(app.getHttpServer())
            .get(`/user/${rearchKey}`)
            .expect(HttpStatus.UNAUTHORIZED)
            .expect(({body}) => {
            expect(body.message).toEqual("Unauthorized");
            })
        });
  });
});