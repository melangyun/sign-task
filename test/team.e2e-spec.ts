import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';
import { CreateTeamDTO } from '../src/modules/team/team.dto';

describe('TEAM', () => {

  let app:INestApplication;
  let accessToken_1:string;
  let accessToken_2:string;

  const register: RegisterDTO[] = [
    { id : "testuser", nickname:"test01", password : "1234"},
    { id : "testuser2", nickname:"test02", password : "1234"},
  ];
  const login_1 : LoginDTO = { id : "testuser" , password : "1234" }
  const login_2 : LoginDTO = { id : "testuser2" , password : "1234" }

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

    // 토큰 받아옴!
    await request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(login_1)
        .then(({body}) => {
            accessToken_1 = body.token;
        });

    await request(app.getHttpServer())
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(login_2)
        .then(({body}) => {
            accessToken_2 = body.token;
        });

  });

  afterAll(async () => {
    await app.close();
  });

  // ! 헐.. 팀 1개 정보 조회하는게 없는것같다.....!;
  describe( "/team (POST)" ,() => {
    it("team creation should be rejected without login", () => {
      const createteam :CreateTeamDTO[] = [
        { name : "testTeam01" },
        { name : "testTeam02" }
      ];
      
      for( let i = 0 ; i < createteam.length ; i++ ){
        request(app.getHttpServer())
          .post('/team')
          .send(createteam[i])
          .expect(HttpStatus.UNAUTHORIZED)
          .expect(({body}) => {
            expect(body.message).toEqual("Unauthorized");
          });
        }
    });
  });

    it("should be successfully created team", async () => {
      const createteam :CreateTeamDTO[] = [
        { name : "testTeam01" },
        { name : "testTeam02" }
      ];
      
      for( let i = 0 ; i < createteam.length ; i++ ){
        await request(app.getHttpServer())
          .post('/team')
          .set('Authorization', `Bearer ${ accessToken_1 }`)
          .send(createteam[i])
          .expect(HttpStatus.CREATED)
          .expect(({body}) => {
            expect(body.teamId).toEqual(i + 1);
            expect(body.leader).toEqual("test01");
          });
        }
    });


  describe( "/team (GET)" ,() => {
    
    // 유저 참여 팀 조회
    it("should get list of participating teams.", () => {
        return request(app.getHttpServer())
          .get('/team')
          .set('Authorization', `Bearer ${ accessToken_1 }`)
          .expect(HttpStatus.OK)
          .expect(({body}) => {
            expect(body).toEqual({
              teamsByLeader : [
                    {
                     "id": 1,
                     "leader": "testuser",
                     "name": "testTeam01",
                   },
                   {
                    "id": 2,
                    "leader": "testuser",
                    "name": "testTeam02",
                  },
                 ],
                 "teamsByMember":  [
                    {
                     "id": 1,
                     "leader": "testuser",
                     "name": "testTeam01",
                   },
                   {
                    "id": 2,
                    "leader": "testuser",
                    "name": "testTeam02",
                  },
                 ]});
          });
    });

    it("should return an empty array when has no join team.", () => {
      return request(app.getHttpServer())
        .get('/team')
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .expect(HttpStatus.OK)
        .expect(({body}) => {
          expect(body).toEqual({ teamsByLeader : [], teamsByMember:  []});
        });
  });

    it("team creation should be rejected without login", () => {
        return request(app.getHttpServer())
          .get('/team')
          .expect(HttpStatus.UNAUTHORIZED)
          .expect(({body}) => {
            expect(body.message).toEqual("Unauthorized");
          });
    });
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