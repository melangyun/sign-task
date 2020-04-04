import { AuthController } from "../../src/modules/auth/auth.controller";
import { AuthService } from "../../src/modules/auth/auth.service";
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { Payload } from "../../src/modules/auth/payload.type";
import { UserService } from "../../src/modules/user/user.service";
import { RegisterDTO } from "../../src/modules/auth/auth.dto";

describe("AppController", () => {
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
      });

    describe("AuthController", () => {
        it("singPayload - JWT should be issued", () => {
            const payload:Payload = { id : "test01", nickname:"user01" };
            authService.signPayload(payload)
                .then( result => {
                    expect(typeof result).toEqual("string");
                })
        });
    
        it("register - Should be registered member", async () => {

            const spyFn = jest.spyOn(userService, "create");
            const registerDTO:RegisterDTO = {id : "test01", password : "1234", "nickname": "user01" };
            const result = await authController.register(registerDTO);
            
            expect(spyFn).toBeCalledTimes(1)
            expect(result).toHaveProperty("id" , registerDTO.id);
            expect(result).toHaveProperty("nickname" , "user01" );
            expect(result).not.toHaveProperty("password");
        });
    });

})