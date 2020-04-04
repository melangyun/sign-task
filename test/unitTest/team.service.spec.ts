import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { TeamService } from 'src/modules/team/team.service';
import { User } from 'src/modules/user/user.entity';




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
    
    describe("verifyTeam (METHOD)", () => {

    });
    
    describe("verifyUser (METHOD)", () => {

    });

    describe("create (METHOD)", () => {

    });

    describe("deleteTeam (METHOD)", () => {

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