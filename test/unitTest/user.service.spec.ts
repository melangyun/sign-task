import { AuthController } from "../../src/modules/auth/auth.controller";
import { AuthService } from "../../src/modules/auth/auth.service";
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { Payload } from "../../src/modules/auth/payload.type";
import { UserService } from "../../src/modules/user/user.service";
import { RegisterDTO, LoginDTO } from "../../src/modules/auth/auth.dto";
import { User } from "../../src/modules/user/user.entity";

describe("UserServoce", () => {
    let authController:AuthController;
    let authService:AuthService;
    let userService: UserService;
    
    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [TestModule]
        })
        .compile();
        
        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
        userService = module.get<UserService>(UserService);

        const user = new User();
        user.id = "admin";
        user.password = "1234";
        user.nickname = "관리자";
        await user.save()

        const deletedUser = new User();
        deletedUser.id = "deleteUser";
        deletedUser.password = "1234";
        deletedUser.nickname = "이미탈퇴한유저입니다.";
        deletedUser.isActive = false;
        await deletedUser.save()

    });
    
    describe("UserService", () => {
        it("create - Should be registered member", async () => {
            const registerDTO1:RegisterDTO = {id : "test01", password : "1234", "nickname": "user01" };
            const result:User = await userService.create(registerDTO1);
            const { id, password } =  registerDTO1;

            expect(result).toHaveProperty("id" , id);
            expect(result).toHaveProperty("nickname" , "user01" );
            expect(result).not.toHaveProperty("password");

            const user:User = await User.findOne(id);
            expect(user.id).toEqual(id);
            expect(user.password).not.toEqual(password);
            
        });
        
        it("finByLogin - login success : Should be return sanitizeUser", async () => {
            const userDTO:LoginDTO = {id :"test01", password : "1234"};
            const sanitizeUser = await userService.findByLogin(userDTO);

            expect(sanitizeUser).toHaveProperty("id" , userDTO.id);
            expect(sanitizeUser).toHaveProperty("nickname" , "user01" );
            expect(sanitizeUser).not.toHaveProperty("password");
        });
        
        it("finByLogin - login fail : Should be throw error", async () => {
            const userDTO:LoginDTO = {id :"abcd", password : "1234"};
            await userService.findByLogin(userDTO)
                .catch(({status, message}) =>{
                    expect(status).toEqual(401);
                    expect(message).toEqual("Invalid credential");
                })
        });

        it("searchUser - Should be return users that meet search criteria", async () => {
            const users:User[] = await userService.searchUser("admin");
            expect(users.length >= 1 ).toBeTruthy();
            expect(users[0]).toHaveProperty("id" , "admin");
            expect(users[0]).not.toHaveProperty("password");
        });

        it("searchUser - Should be return users that meet search criteria", async () => {
            const users:User[] = await userService.searchUser("abcd");
            expect(users.length === 0 ).toBeTruthy();
        });

        it("verifyUser", async () => {
            const user:User = await userService.verifyUser("admin")
            expect(user.password).toBeUndefined();
            expect(user.id).toEqual("admin");
            expect(user.nickname).toEqual("관리자");
         });

        it("verifyUser - invalid Id", async () => {
           await userService.verifyUser("abcd")
           .catch(({status, message}) =>{
                expect(status).toEqual(404);
                expect(message).toEqual("Invalid user");
          });
        });

        it("verifyUser - deleted user", async () => {
            await userService.verifyUser("deleteUser")
            .catch(({status, message}) =>{
                 expect(status).toEqual(403);
                 expect(message).toEqual("Unable to access deleted member.");
           });
         });

    });
        
    describe("AuthService", () => {
        
        it("register - Should be registered member", async () => {
           
        });
        
        it("singPayload - JWT should be issued", () => {
           
        });
    });

})