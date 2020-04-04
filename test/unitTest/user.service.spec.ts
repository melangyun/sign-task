import { AuthController } from "../../src/modules/auth/auth.controller";
import { AuthService } from "../../src/modules/auth/auth.service";
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { Payload } from "../../src/modules/auth/payload.type";
import { UserService } from "../../src/modules/user/user.service";
import { RegisterDTO } from "../../src/modules/auth/auth.dto";
import { User } from "../../src/modules/user/user.entity";
import { getConnection } from "typeorm";

describe("UserServoce", () => {
    let authController:AuthController;
    let authService:AuthService;
    let userService: UserService;
    const registerDTO_1:RegisterDTO = {id : "test01", password : "1234", "nickname": "user01" };
    const registerDTO_2:RegisterDTO = {id : "test02", password : "1234", "nickname": "user02" };

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [TestModule]
        })
        .compile();
        
        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
        userService = module.get<UserService>(UserService);
      });
    
    describe("UserService", () => {

        it("create - Should be registered member", async () => {
            const result:User = await userService.create(registerDTO_1);
            const { id, password } =  registerDTO_1;

            expect(result).toHaveProperty("id" , id);
            expect(result).toHaveProperty("nickname" , "user01" );
            expect(result).not.toHaveProperty("password");

            const user:User = await User.findOne(id);
            expect(user.id).toEqual(id);
            expect(user.password).not.toEqual(password);
            
        });
        it("finByLogin - Should be registered member", () => {
           
        });
        it("searchUser - Should be registered member", () => {
           
        });

        it("searchUser - Should be registered member", () => {
           
        });

    });
        
    describe("AuthService", () => {
        
        it("register - Should be registered member", async () => {
            const userSpy = jest.spyOn(userService, "create");
            const result = await authController.register(registerDTO_2);

            expect(userSpy).toBeCalledTimes(1)
            expect(result).toHaveProperty("id" , registerDTO_2.id);
            expect(result).toHaveProperty("nickname" , "user01" );
            expect(result).not.toHaveProperty("password");
        });
        
        it("singPayload - JWT should be issued", () => {
            const payload:Payload = { id : "test01", nickname:"user01" };
            authService.signPayload(payload)
                .then( result => {
                    expect(typeof result).toEqual("string");
                })
        });
    });

})