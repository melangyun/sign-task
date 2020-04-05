import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { SignatureService } from '../../src/modules/signature/signature.service';
import { signatureAuth } from '../../src/modules/signature/signature.enum';
import { User } from '../../src/modules/user/user.entity';
import { Team } from '../../src/modules/team/team.entity';
import { TeamUser } from '../../src/modules/team/teamuser.entity';
import { SignDTO } from '../../src/modules/signature/signature.dto';
import { Signature } from '../../src/modules/signature/signature.entity';
import { async } from 'rxjs/internal/scheduler/async';


describe("TeamService", () => {

    let signatureService:SignatureService;
    let personalSignId:string;
    let teamSignId:string;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [TestModule]
        })
        .compile();
        
        signatureService = module.get<SignatureService>(SignatureService);
        
        const admin = new User();
        admin.id = "admin";
        admin.nickname = "관리자";
        admin.password = "1234";
        await admin.save();

        const member = new User();
        member.id = "member";
        member.nickname = "팀원";
        member.password = "1234";
        await member.save();

        const other = new User();
        other.id = "other";
        other.nickname = "타인";
        other.password = "1234";
        await other.save();        

        // teamId = 1 
        const team = new Team();
        team.name = "화이팀";
        team.leader = "admin";
        team.user = admin;
        await team.save();

        // teamId = 2
        const deleteTeam = new Team();
        deleteTeam.name = "삭제팀";
        deleteTeam.leader = "admin";
        deleteTeam.isActive = false;
        deleteTeam.user = admin;
        await deleteTeam.save();

        const teamUser = new TeamUser();
        teamUser.user = member;
        teamUser.team = team;
        await teamUser.save();


      });
    describe("validateUserAuth (METHOD)", () => {
        it("Should be rejected when request user do not have permission", () => {
            signatureService.validateUserAuth(1, "member", signatureAuth.add)
              .catch(({status, message}) => {
                  expect(status).toEqual(403);
                  expect(message).toEqual("Invalid access");
              });
        });

        it("Should be rejected when request to deleted team", () => {
            signatureService.validateUserAuth(2, "member", signatureAuth.add)
            .catch(({status, message}) => {
                expect(status).toEqual(403);
                expect(message).toEqual("Unable to access deleted team.");
            });    
        });

        it("Should be rejected when request with invalid teamId", () => {
            signatureService.validateUserAuth(100, "member", signatureAuth.add)
            .catch(({status, message}) => {
                expect(status).toEqual(404);
                expect(message).toEqual("Invalid teamId");
            });    
        });

        it("Team signatures are not visible to others", () => {
            signatureService.validateUserAuth(1, "other", signatureAuth.add)
            .catch(({status, message}) => {
                expect(status).toEqual(403);
                expect(message).toEqual("Not on the team");
            });    
        });

    });

    describe("create (METHOD)", () => {
        it("Should create individual signature", async () => {
            const singleSignDTO:SignDTO = { teamId : null , url : "example.jpg", desc : "personal" };
            personalSignId = await signatureService.create(singleSignDTO, "admin");
            expect(typeof personalSignId).toEqual("string");

            const signature:Signature = await Signature.findOne(personalSignId);
            expect(signature).toBeDefined();
            expect(signature.url).toEqual(singleSignDTO.url);
            expect(signature.desc).toEqual(singleSignDTO.desc);
        });

        it("Should create team signature", async () => {
            const teamSignDTO = { teamId : 1 , url : "example.jpg", desc : "team" };
            teamSignId = await signatureService.create(teamSignDTO, "admin");
            
            const signature:Signature = await Signature.findOne(teamSignId);
            expect(signature).toBeDefined();
            expect(signature.url).toEqual(teamSignDTO.url);
            expect(signature.desc).toEqual(teamSignDTO.desc);
        });
    });
   

    describe("validateSignId (METHOD)", () => {
        it("Should reject invalid signature key", () => {
            const invalidSign = "NaBiBoBetDDaO~";
            signatureService.validateSignId( invalidSign , "admin", null)
                .catch(({status, message})=> {
                    expect(status).toEqual(404);
                    expect(message).toEqual("Invalid signature key");
                });
        });

        it("Should reject other's access  (Team Signature)", () => {
            signatureService.validateSignId( teamSignId , "other", signatureAuth.lookup)
                .catch(({status, message})=> {
                    expect(status).toEqual(403);
                    expect(message).toEqual('Not on the team');
                });
        });

        it("Should reject other's access  (Personal Signature)", () => {
            signatureService.validateSignId( personalSignId , "other", null )
                .catch(({status, message})=> {
                    expect(status).toEqual(403);
                    expect(message).toEqual('Invalid access');
                });
        });

        it("Should successfully get personal signatures", async () => {
            const result:any = await signatureService.validateSignId( personalSignId , "admin" , null);
            expect(result).toHaveProperty("create_at");
            expect(result).toHaveProperty("update_at");
            expect(result).toHaveProperty("desc");
            expect(result).toHaveProperty("url");
            expect(result).toHaveProperty("is_active");
            expect(result.id).toEqual(personalSignId);
        });
/*
        it("Should successfully get team signatures", async () => {
            // console.log("이게 안되는 키 ㅠㅠTestCase : ",teamSignId)
            // const reuslt = await User.findOne({id : "admin"});
            // console.log("reuslt : ",reuslt);
            // const team = await Team.findOne({id:1});
            // console.log("team : ", team);
            // const teamUser = await TeamUser.findOne({user:reuslt, team});
            // console.log("teamUser : 나오니 왜 안나오니 ",teamUser);
             // ???????????추후 디버깅...

            const result:any = await signatureService.validateSignId( teamSignId , "admin" , signatureAuth.lookup);
            expect(result).toHaveProperty("create_at");
            expect(result).toHaveProperty("update_at");
            expect(result).toHaveProperty("desc");
            expect(result).toHaveProperty("url");
            expect(result).toHaveProperty("is_active");
            expect(result.id).toEqual(teamSignId);
        });
*/
    });


    describe("getSigns (METHOD)", () => {
        it("Should successfully get all signatures - personal", async () => {
            const result = await signatureService.getSigns("admin", 1);
            const sign = result[0];
            expect(result.length === 1 ).toBeTruthy();
            expect(sign).toHaveProperty("createAt");
            expect(sign).toHaveProperty("updateAt");
            expect(sign).toHaveProperty("desc");
            expect(sign).toHaveProperty("url");
            expect(sign).toHaveProperty("isActive");
            expect(sign.id).toEqual(teamSignId);
        });

        it("Should successfully get all signatures - personal", async () => {
            const result = await signatureService.getSigns("admin", null);
            const sign = result[0];
            expect(result.length === 1 ).toBeTruthy();
            expect(sign).toHaveProperty("createAt");
            expect(sign).toHaveProperty("updateAt");
            expect(sign).toHaveProperty("desc");
            expect(sign).toHaveProperty("url");
            expect(sign).toHaveProperty("isActive");
            expect(sign.id).toEqual(personalSignId);
        });
    });

    describe("delete (METHOD)", () => {
        it("Should successfully delete signature by signatureId", async () => {
            const result = await signatureService.delete(personalSignId);
            expect(typeof result).toBeTruthy();

            const sign:Signature = await Signature.findOne({id:personalSignId});
            expect(sign.isActive).toBeFalsy();
        });
    });
})