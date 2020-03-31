import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RegisterDTO, LoginDTO } from "../src/modules/auth/auth.dto";
import { HttpStatus, INestApplication } from '@nestjs/common';;
import { AuthService } from "../src/modules/auth/auth.service";
import { AuthController } from "../src/modules/auth/auth.controller";
import { AppModule } from "../src/modules/main/app.module";
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
});