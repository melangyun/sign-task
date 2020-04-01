import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "./test.module";
import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../src/modules/auth/auth.dto';
import { CreateTeamDTO, DeleteTeamDTO, TeamUserDTO, ModifyPermissionDTO } from '../src/modules/team/team.dto';

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

  // 팀 생성
  describe( "/team (POST)" ,() => {
    // 로그인 없이 팀 생성이 되지 않아야함
    it("team creation should be rejected without login", async () => {
      const createteam :CreateTeamDTO[] = [
        { name : "testTeam01" },
        { name : "testTeam02" }
      ];
      
      for( let i = 0 ; i < createteam.length ; i++ ){
        await request(app.getHttpServer())
          .post('/team')
          .send(createteam[i])
          .expect(HttpStatus.UNAUTHORIZED)
          .expect(({body}) => {
            expect(body.message).toEqual("Unauthorized");
          });
        }
    });
  });

  // 팀생성(정상 성공)
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


    // 유저 참여 팀 조회
  describe( "/team (GET)" ,() => {
    // 정상 조회
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

    // 조인된 팀이 없다면 빈 배열을 반환해 주어야함
    it("should return an empty array when has no join team.", () => {
      return request(app.getHttpServer())
        .get('/team')
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .expect(HttpStatus.OK)
        .expect(({body}) => {
          expect(body).toEqual({ teamsByLeader : [], teamsByMember:  []});
        });
  });

    // 로그인 없는 팀 조회는 reject
    it("team creation should be rejected without login", () => {
        return request(app.getHttpServer())
          .get('/team')
          .expect(HttpStatus.UNAUTHORIZED)
          .expect(({body}) => {
            expect(body.message).toEqual("Unauthorized");
          });
    });
  });

  // 팀 삭제
  describe( "/team (DELETE)" ,() => {

    const deleteTeamDTO:DeleteTeamDTO = { "teamId" : 1 };

    // 로그인 없이는 reject
    it("should reject delete team without login", () => {
      return request(app.getHttpServer())
        .delete("/team")
        .send(deleteTeamDTO)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body}) => {
          expect(body.message).toEqual("Unauthorized");
        });
   });

    // 정상 삭제 성공
    it("should delete participating team", () => {
        return request(app.getHttpServer())
          .delete("/team")
          .set('Authorization', `Bearer ${ accessToken_1 }`)
          .send(deleteTeamDTO)
          .expect(HttpStatus.OK)
          .expect(({body}) => {
             expect(body.result).toBeDefined();
          });
    });

    // 삭제된 팀에 접근 시도시 접근 할 수 없는 요청
    it("should not access to deleted team", () => {
      return request(app.getHttpServer())
        .delete("/team")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(deleteTeamDTO)
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect(({body}) => {
           expect(body.message).toEqual("Unable to access deleted team.");
        });
  });

  // 삭제된 팀은 조회시 조회되지 않아야함
  it("Should not be inquired deleted teams", () => {
    return request(app.getHttpServer())
      .get('/team')
      .set('Authorization', `Bearer ${ accessToken_1 }`)
      .expect(HttpStatus.OK)
      .expect(({body}) => {
        expect(body).not.toContain({
          teamsByLeader : [
               {
                "id": 1,
                "leader": "testuser",
                "name": "testTeam01",
              },
             ],
             "teamsByMember":  [
               {
                "id": 1,
                "leader": "testuser",
                "name": "testTeam01",
              },
             ]});
      });
  });
    
});


  describe("/team/{teamId} (GET)", () => {
    // 팀 정보 조회
    it("Should be return team Information", () => {
      const teamId = 2;

      return request(app.getHttpServer())
        .get(`/team/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.OK)
        .expect(({body})=> {
          expect(body).toHaveProperty("id");
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("isActive");
          expect(body).toHaveProperty("leader");
          expect(body).toHaveProperty("createAt");
          expect(body).toHaveProperty("updateAt");
        })
    });

    // 삭제된 팀은 reject되어야 함
    it("should not access to deleted team", () => {
      const teamId = 1;
      return request(app.getHttpServer())
        .get(`/team/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect(({body})=> {
          expect(body.message).toEqual("Unable to access deleted team.");
        });
    });

    // 로그인 없이는 reject
    it("should not access without login", () => {
      const teamId = 2;
      return request(app.getHttpServer())
        .get(`/team/${teamId}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });

    // 없는 팀 접근 불가
    it("should not access to Invalid teamId", () => {
      const teamId = 3;
      return request(app.getHttpServer())
        .get(`/team/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=> {
          expect(body.message).toEqual("Invalid teamId");
        });
    });

    // 가입되지 않았다면 접근 불가
    it("Should not be accessed if not join in", () => {
      const teamId = 2;
      return request(app.getHttpServer())
        .get(`/team/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });

  });

  describe( "/team/user/{teamId} (GET)" ,() => {

    // 로그인 없이는 reject
    it("should not access without login", () => {
      const teamId = 2;
      return request(app.getHttpServer())
        .get(`/team/user/${teamId}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });

    // 삭제된 팀은 접근시 reject
    it("should not access to deleted team", () => {
      const teamId = 1;
      return request(app.getHttpServer())
        .get(`/team/user/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect(({body})=> {
          expect(body.message).toEqual("Unable to access deleted team.");
        });
    });

    // 가입되지 않았다면 접근 불가
    it("Should not be accessed if not join in", () => {
      const teamId = 2;
      return request(app.getHttpServer())
        .get(`/team/user/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=> {
          expect(body.message).toEqual("Unauthorized");
        });
    });

    // 정상적으로 받았을 경우 배열과 함께 유저, 권한이 첨부되어 있어야함
    it("Should receive team members and auth", () => {
      const teamId = 2;
      return request(app.getHttpServer())
        .get(`/team/user/${teamId}`)
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .expect(HttpStatus.OK)
        .expect(({body})=> {
          expect(body.length >= 1 ).toBeTruthy();
          expect(body[0]).toHaveProperty("auth");
          expect(body[0]).toHaveProperty("user");
          expect(body[0].auth).toHaveProperty("lookup");
          expect(body[0].auth).toHaveProperty("add");
          expect(body[0].auth).toHaveProperty("delete");
          expect(body[0].user).toHaveProperty("id");
          expect(body[0].user).toHaveProperty("nickname");
        });
    });
  });

  // 유저 등록
  describe( "/team/user (POST)" ,() => {
    // 유저와 팀이 Invalid할때 reject
    it("should rejected invalid user or team", async () => {
      // 없는 teamId
      const teamUserDTO:TeamUserDTO = { teamId: 100, memberId: "testuser2" };
      await request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(teamUserDTO)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=>{
          expect(body.message).toEqual("Invalid teamId");
        });
      
      // 없는 memberId
      const teamUserDTO_1:TeamUserDTO = { teamId: 2, memberId: "testuser10" };
      await request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(teamUserDTO_1)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=>{
          expect(body.message).toEqual("Invalid user");
        });
    });

    // 삭제된 팀 접근
    it("should rejected deleted team", () => {
      const teamUserDTO:TeamUserDTO = { teamId: 1, memberId: "testuser2" };
      return request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(teamUserDTO)
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect(({body})=>{
          expect(body.message).toEqual("Unable to access deleted team.");
        });
    });

    // 팀 리더가 아닐경우 거부
    it( "Should reject if not team leader", () => {
      const teamUserDTO:TeamUserDTO = { teamId: 2, memberId: "testuser2" };
      return request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .send(teamUserDTO)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=>{
          expect(body.message).toEqual("Unauthorized access");
        });
    });

    // 유저 등록 성공
    it("should be added user successfully", () => {
      const teamUserDTO:TeamUserDTO = { teamId: 2, memberId: "testuser2" };
      return request(app.getHttpServer())
        .post("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(teamUserDTO)
        .expect(HttpStatus.CREATED)
        .expect(({text})=>{
          expect(text).toEqual("User Added Successfully");
        });
    });
  });

  // 유저 권한 수정
  describe( "/team/user (PATCH)" ,() => {
    const auth = { "lookup" : true, "delete" : false, "add" : true };

    // 유저와 팀이 Invalid할때 reject
    it("should rejected invalid user or team", async () => {
      // 없는 teamId
      const modifyPermissionDTO:ModifyPermissionDTO = { teamId: 100, memberId:"testuser2", auth };
      await request(app.getHttpServer())
        .patch("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(modifyPermissionDTO)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=>{
          expect(body.message).toEqual("Invalid teamId");
        });
      
        //없는 아이디..
      const modifyPermissionDTO_1:ModifyPermissionDTO = { teamId: 2, memberId:"invalidUser", auth };

      await request(app.getHttpServer())
        .patch("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(modifyPermissionDTO_1)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=>{
          expect(body.message).toEqual("Invalid user");
        });
    });

    // 삭제된 팀 접근
    it("should rejected deleted team", () => {
      const modifyPermissionDTO:ModifyPermissionDTO = { teamId: 1, memberId:"testuser2", auth };
      return request(app.getHttpServer())
        .patch("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(modifyPermissionDTO)
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect(({body})=>{
          expect(body.message).toEqual("Unable to access deleted team.");
        });
    });

    // 정상 정보
    const modifyPermissionDTO:ModifyPermissionDTO = { teamId: 2, memberId:"testuser2", auth };
    // 팀 리더가 아닐경우 거부
    it( "Should reject if not team leader", () => {
      return request(app.getHttpServer())
        .patch("/team/user")
        .set('Authorization', `Bearer ${ accessToken_2 }`)
        .send(modifyPermissionDTO)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({body})=>{
          expect(body.message).toEqual("Unauthorized access");
        });
    });

    
    // 변경 성공
    it("Should modify user signature auth", () => {
      return request(app.getHttpServer())
      .patch("/team/user")
      .set('Authorization', `Bearer ${ accessToken_1 }`)
      .send(modifyPermissionDTO)
      .expect(HttpStatus.OK)
      .expect(({text})=>{
        expect(text).toEqual("Permission modification succeeded");
      });
    });
    // 가입되지 않은 유저의 경우 실패
    it("In the case of users who are not on the team, the request should be rejected.",async () => {
      const register :RegisterDTO = { id : "hong1234", nickname:"testUser", password : "1234"};
      const login :LoginDTO = { id : "hong1234" , password : "1234" };
      let token :string;

      await request(app.getHttpServer())
          .post("/auth/register")
          .set("Accept", "application/json")
          .send(register);

      await request(app.getHttpServer())
          .post("/auth/login")
          .set("Accept", "application/json")
          .send(login)
          .then(({body})=> {
            token = body.token;
          })

      const modifyPermissionDTO:ModifyPermissionDTO = { teamId: 2, memberId:"hong1234", auth };

      return await request(app.getHttpServer())
        .patch("/team/user")
        .set('Authorization', `Bearer ${ accessToken_1 }`)
        .send(modifyPermissionDTO)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({body})=>{
          expect(body.message).toEqual("Invalid teamMember");
        });

    });
    
  });

  describe( "/team/user (DELETE)" ,() => {
    
  });

  describe( "/team/user/auth/{teamId} (GET)" ,() => {

  });

});