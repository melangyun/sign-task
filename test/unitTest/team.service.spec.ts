import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { TeamService } from '../../src/modules/team/team.service';
import { User } from '../../src/modules/user/user.entity';
import { Team } from '../../src/modules/team/team.entity';


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
    
    describe("verifyUser (METHOD)", () => {
        
    });



    describe("addUser (METHOD)", () => {

    });

    describe("modifyPermissions (METHOD)", () => {

    });

    describe("findAllMyTeam (METHOD)", () => {

    });

    describe("findAllMyTeam (METHOD)", () => {

    });

    describe("findAllJoinTeam (METHOD)", () => {

    });

    describe("getUsers (METHOD)", () => {

    });

    describe("deleteUser (METHOD)", () => {

    });

    describe("getTeamUser (METHOD)", () => {

    });

})