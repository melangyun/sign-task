import * as request from 'supertest';
import { RegisterDTO, LoginDTO } from "../src/modules/auth/auth.dto";
import { HttpStatus } from '@nestjs/common';;
import { app } from './constants';

describe('AUTH', () => {

  const user: RegisterDTO = { id : "testuser", nickname:"test01", password : "1234"};
  
  it('should register', () => {
    return request(app)
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
    return request(app)
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

    return request(app)
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