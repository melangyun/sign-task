import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { TeamService } from '../../src/modules/team/team.service';
import { User } from '../../src/modules/user/user.entity';
import { Team } from '../../src/modules/team/team.entity';
import { TeamUser } from '../../src/modules/team/teamuser.entity';
import { signatureAuth } from '../../src/modules/signature/signature.enum';
import { ModifyPermissionDTO } from 'src/modules/team/team.dto';


describe("TeamService", () => {

    let teamService:TeamService;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [TestModule]
        })
        .compile();
        
        teamService = module.get<TeamService>(TeamService);

        const user = new User();
        user.id = "admin";
        user.password = "1234";
        user.nickname = "관리자";
        await user.save()

        const member = new User();
        member.id = "member";
        member.password = "1234";
        member.nickname = "참여자";
        await member.save()
        
      });

    describe("create (METHOD)", () => {
       
        it("should be successfully create", async () => {
            const teamId:number = await teamService.create("화이팀", "admin");
            expect(teamId > 0 ).toBeTruthy();
            const team:Team = await Team.findOne({id : teamId});
            expect(team).toBeDefined();
            expect(team.id).toEqual(teamId);
       });

       it("Should be successful if created with the same name", async () => {
            const teamId:number = await teamService.create("화이팀", "admin");
            expect(teamId > 0 ).toBeTruthy();
            const team:Team = await Team.findOne({id : teamId});
            expect(team).toBeDefined();
            expect(team.id).toEqual(teamId);
         });
    });
    
    describe("deleteTeam (METHOD)", () => {
        it("should delete team successfully", async () => {
            const id = 2;
            const result:string = await teamService.deleteTeam({ teamId : id});
            expect(typeof result).toBe("string");

            const team = await Team.findOne({id});
            expect(team.isActive).toBeFalsy();
        });
    });

    describe("verifyTeam (METHOD)", () => {
        it("should be reject deleted team", async () => {
            const id = 2;
            teamService.verifyTeam(id).catch(({status, message}) => {
                expect(status).toEqual(403);
                expect(message).toEqual('Unable to access deleted team.');
            })
        });

        it("should be reject Invalid team", async () => {
            const id = 100;
            teamService.verifyTeam(id).catch(({status, message}) => {
                expect(status).toEqual(404);
                expect(message).toEqual('Invalid teamId');
            });
        });

        it("should be return correct team", async () => {
            const id = 1;
            const team:Team = await teamService.verifyTeam(id);
            const foundTeam = await Team.findOne({id});
            expect(team.id).toEqual(foundTeam.id);
            expect(team.name).toEqual(foundTeam.name);
            
        });
    });

    describe("addUser (METHOD)", () => {
        it("should be added team member", async () => {
            const team = new Team();
            team.id = 1;
            const member = new User();
            member.id = "member";

            await teamService.addUser(team, member);

            const teamUser = await TeamUser.findOne({team , user:member});
            expect(teamUser.auth).toHaveProperty(signatureAuth.lookup);
            expect(teamUser.auth).toHaveProperty(signatureAuth.delete);
            expect(teamUser.auth).toHaveProperty(signatureAuth.add);
        });
    });

    describe("findAllMyTeam (METHOD)", () => {
        it("should find my team", async () => {
            const userId = "admin";
            const teamsByLeader:Team[] = await teamService.findAllMyTeam(userId);

            expect(teamsByLeader.length).toEqual(1);
            expect(teamsByLeader.length).not.toEqual(2);
            expect(teamsByLeader[0].name).toEqual("화이팀");
            expect(teamsByLeader[0].id).toEqual(1);
        });
        it("should return Empty array ", async () => {
            const userId = "member";
            const teamByLeader:Team[] = await teamService.findAllMyTeam(userId);

            expect(teamByLeader.length).toEqual(0);
        });
    });

    describe("findAllJoinTeam (METHOD)", () => {
        it("Even if you participate as a team leader, should be registered as a participant.", async () => {
            const userId = "admin"
            const teamsByMember:Team[] = await teamService.findAllJoinTeam(userId);

            expect(teamsByMember.length).toEqual(1);
            expect(teamsByMember.length).not.toEqual(2);
            expect(teamsByMember[0].leader).toEqual("admin");
            expect(teamsByMember[0].id).not.toEqual(2);
        });
    });

    describe("modifyPermissions (METHOD)", () => {
        it("should reject Invalid teamMember", () =>{
            const memberId = "invalid user";
            const modifyPermissionDTO:ModifyPermissionDTO = { teamId : 1, memberId, auth: {add : true, delete: true, lookup:true} };
            teamService.modifyPermissions(modifyPermissionDTO).catch(({status, message}) => {
                expect(status).toEqual(404);
                expect(message).toEqual("Invalid teamMember");
            });
        });

        it("should change success", async () =>{
            const memberId = "member";
            const teamId = 1;
            const auth =  {add : true, delete: true, lookup:true};

            const modifyPermissionDTO:ModifyPermissionDTO = { teamId, memberId, auth };
            const result:string = await teamService.modifyPermissions(modifyPermissionDTO);
            expect(typeof result).toEqual("string");

            const team = new Team();
            team.id = teamId;
            const user = new User();
            user.id = memberId;

            const teamUser:TeamUser = await TeamUser.findOne({team, user});
            expect(teamUser.auth).toHaveProperty(signatureAuth.add, true);
            expect(teamUser.auth).toHaveProperty(signatureAuth.delete, true);
            expect(teamUser.auth).toHaveProperty(signatureAuth.lookup, true);
        });
    });

    describe("getTeamUser (METHOD)", () => {

    });

    describe("getUsers (METHOD)", () => {

    });

    describe("deleteUser (METHOD)", () => {

    });


})