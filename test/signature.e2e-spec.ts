import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';
import { CreateTeamDTO } from '../src/modules/team/team.dto';

describe('SIGNATURE', () => {

  let app:INestApplication;
  let accessToken_1:string;
  let accessToken_2:string;
  let accessToken_3:string;

  let signId_Private:string;
  let signId_Team:string;

  const register: RegisterDTO[] = [
    { id : "testuser", nickname:"test01", password : "1234"},
    { id : "testuser2", nickname:"test02", password : "1234"},
    { id : "testuser3", nickname:"test03", password : "1234"}
  ];
  const login_1 : LoginDTO = { id : "testuser" , password : "1234" };
  const login_2 : LoginDTO = { id : "testuser2" , password : "1234" };
  const login_3 : LoginDTO = { id : "testuser3" , password : "1234" }

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
          .send(register[i]);
    }

    // 토큰 받아옴! - 유저 1
    await request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(login_1)
        .then(({body}) => {
            accessToken_1 = body.token;
        });
    
    // 유저 2
    await request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(login_2)
        .then(({body}) => {
            accessToken_2 = body.token;
        });
    
    // 유저 3
    await request(app.getHttpServer())
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(login_3)
      .then(({body}) => {
          accessToken_3 = body.token;
      });

    // 팀 생성
    await request(app.getHttpServer())
        .post("/team")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({name : "team01"})
  
    await request(app.getHttpServer())
        .post("/team")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({name : "team02"})

    // 팀 삭제
    await request(app.getHttpServer())
        .delete("/team")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({teamId : 2})

    // 맴버 초대
    await request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({ teamId : 1 , memberId : "testuser2" })
  });

  afterAll(async () => {
    await app.close();
  });

  // 서명 생성
  describe( "/signature (POST)" ,() => {
    //생성 권한이 없는 유저의 서명 등록
    it("Should be rejected when request user do not have permission", () => {
        const teamSignDTO = { teamId : 1 , url : "example.jpg", desc : "team" };
        return request(app.getHttpServer())
          .post("/signature")
          .set('Authorization', `Bearer ${ accessToken_2 }`)
          .send(teamSignDTO)
          .expect(HttpStatus.FORBIDDEN)
          .expect(({body})=> {
            expect(body.message).toEqual("Invalid access");
          });
      });
  
      // 삭제된 팀에 접근
      it("Should be rejected when request to deleted team", () => {
          const teamSignDTO = { teamId : 2 , url : "example.jpg", desc : "team" };
          return request(app.getHttpServer())
            .post("/signature")
            .set('Authorization', `Bearer ${ accessToken_1 }`)
            .send(teamSignDTO)
            .expect(HttpStatus.FORBIDDEN)
            .expect(({body})=> {
              expect(body.message).toEqual("Unable to access deleted team.");
            });
        });
    
    // 유효하지 않은 teamID
    it("Should reject when invalid teamId", () => {
      const singleSignDTO = { teamId : 100 , url : "example.jpg", desc : "private" };
      return request(app.getHttpServer())
        .post("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(singleSignDTO)
        .expect(HttpStatus.NOT_FOUND)
        .expect(({body})=> {
          expect(body.message).toEqual("Invalid teamId");
        });
    });
    
    // 토큰 없이는 거부되어야 함
    it("Should be rejected without a token", () => {
      const teamSignDTO = { teamId : 1 , url : "example.jpg", desc : "private" };
      return request(app.getHttpServer())
        .post("/signature")
        .send(teamSignDTO)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    })

    // 서명 등록
    it("Should create signature", async () => {
      //개인 서명
      const singleSignDTO = { teamId : null , url : "example.jpg", desc : "team" };
      await request(app.getHttpServer())
        .post("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(singleSignDTO)
        .expect(HttpStatus.CREATED)
        .expect(({body})=> {
          expect(body).toHaveProperty("registeredId");
          signId_Private = body.registeredId;
        });

      //팀 서명
      const teamSignDTO = { teamId : 1 , url : "example.jpg", desc : "private" };
      await request(app.getHttpServer())
        .post("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(teamSignDTO)
        .expect(HttpStatus.CREATED)
        .expect(({body})=> {
          expect(body).toHaveProperty("registeredId");
          signId_Team = body.registeredId;
        });
    })
  });

  // 개인 서명을 가지고 옴
  describe( "/signature/user (GET)" ,() => {
    it("Bringing in a Personal Signature", ()=> {
      return request(app.getHttpServer())
        .get("/signature/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.OK)
        .expect(({body})=> {
          expect(body.length >= 1 ).toBeTruthy();
          expect(body[0]).toHaveProperty("createAt");
          expect(body[0]).toHaveProperty("updateAt");
          expect(body[0]).toHaveProperty("desc");
          expect(body[0]).toHaveProperty("id");
          expect(body[0]).toHaveProperty("url");
          expect(body[0]).toHaveProperty("isActive");
        });
    });

    // 토큰 없이는 reject
    it("Should be rejected without a token", ()=> {
      return request(app.getHttpServer())
        .get("/signature/user")
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });
    
  });
  
  // 서명 아이디로 조회
  describe( "/signature/signature/{signId} (GET)" ,() => {
    // 개인 서명을 다른사람이 접근할때 reject
    it("Personal signatures are not visible to others", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/${signId_Private}`)
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .expect(HttpStatus.FORBIDDEN)
        .expect(({body})=> {
          expect(body.message).toEqual("Invalid access");
        });
    });

     // 성공적으로 개인 서명을 가져옴
    it("Successfully get personal signatures", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/${signId_Private}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.OK)
        .expect(({body})=> {
          expect(body).toHaveProperty("create_at");
          expect(body).toHaveProperty("update_at");
          expect(body).toHaveProperty("desc");
          expect(body).toHaveProperty("id");
          expect(body).toHaveProperty("url");
          expect(body).toHaveProperty("is_active");
        });
    });

    // 팀 서명을 소속되지 않은 사람이 접근할때 reject
    it("Personal signatures are not visible to others", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/${signId_Private}`)
        .set('Authorization', `Bearer ${ accessToken_3 }`)
        .expect(HttpStatus.FORBIDDEN)
        .expect(({body})=> {
          expect(body.message).toEqual("Invalid access");
        });
    });

    // 토큰 없이는 reject
    it("Should be rejected without a token", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/${signId_Private}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });

    // 성공적으로 팀 서명을 가져옴
    it("Successfully get team signatures.", ()=> {
    return request(app.getHttpServer())
      .get(`/signature/${signId_Team}`)
      .set('Authorization', `Bearer ${ accessToken_1 }`)
      .expect(HttpStatus.OK)
      .expect(({body})=> {
        expect(body).toHaveProperty("create_at");
        expect(body).toHaveProperty("update_at");
        expect(body).toHaveProperty("desc");
        expect(body).toHaveProperty("id");
        expect(body).toHaveProperty("url");
        expect(body).toHaveProperty("is_active");
      });
  });
  
  });

    // 소속 팀 서명 조회
    describe( "/signature/team/{teamId} (GET)" ,() => {
      
    const teamId = 1;
      // 토큰 없이는 reject
    it("Should be rejected without a token", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/team/${teamId}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });
    // 팀 서명을 소속되지 않은 사람이 접근할때 reject
    it("Team signatures are not visible to others", ()=> {
      return request(app.getHttpServer())
        .get(`/signature/team/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_3 }`)
        .expect(HttpStatus.FORBIDDEN)
        .expect(({body})=> {
          expect(body.message).toEqual("Not on the team");
        });
    });

      it("Successfully get team signatures", () => {
        return request(app.getHttpServer())
          .get(`/signature/team/${teamId}`)
          .set('Authorization', `Bearer ${ accessToken_1 }`)
          .expect(HttpStatus.OK)
          .expect(({body})=> {
            const sign = body[0];
            expect(body.length >= 1 ).toBeTruthy();
            expect(sign).toHaveProperty("createAt");
            expect(sign).toHaveProperty("updateAt");
            expect(sign).toHaveProperty("desc");
            expect(sign).toHaveProperty("id");
            expect(sign).toHaveProperty("url");
            expect(sign).toHaveProperty("isActive");
       });
      });

      // 삭제된 팀 접근 거부
      it("should not access to deleted team", ()=> {
        const deletedTeamId = 2; 
        return request(app.getHttpServer())
          .get(`/signature/team/${2}`)
          .set('Authorization', `Bearer ${ accessToken_1 }`)
          .expect(HttpStatus.FORBIDDEN)
          .expect(({body})=> {
            expect(body.message).toEqual("Unable to access deleted team.");
          });
      });


    });
  
  // 서명 삭제
  describe( "/signature (DELETE)" ,() => {
    
    // 타인이 접근
    it("shoul be rejected when the others access to signature", () => {
      return request(app.getHttpServer())
      .delete("/signature")
      .set('Authorization', `Bearer ${ accessToken_2 }`)
      .send({signatureId : signId_Private})
      .expect(HttpStatus.FORBIDDEN)
      .expect(({body})=> {
        expect(body.message).toEqual("Invalid access");
      });
    });
    

    // 팀 권한이 없는 유저가 접근
    it("Should be rejected when requested by unauthorized user (team signature)", () => {
      return request(app.getHttpServer())
        .delete("/signature")
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .send({signatureId : signId_Team})
        .expect(HttpStatus.FORBIDDEN)
        .expect(({body})=> {
          expect(body.message).toEqual('Invalid access');
        })
    });

    // 서명 키가 일치하지 않을때!
    it("Invalid signature key", () => {
      return request(app.getHttpServer())
        .delete("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({signatureId : (signId_Private+1)})
        .expect(HttpStatus.NOT_FOUND)
        .expect(({body})=> {
          expect(body.message).toEqual("Invalid signature key");
        });
    });

    // 정상 접근
    it("Successfully delete Signature (private)", () => {
      return request(app.getHttpServer())
        .delete("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({signatureId : signId_Private})
        .expect(HttpStatus.OK)
    });
    
    // 정상 접근
    it("Successfully delete Signature (team)", () => {
      return request(app.getHttpServer())
        .delete("/signature")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send({signatureId : signId_Team})
        .expect(HttpStatus.OK)
    });
  });
});