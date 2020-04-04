import { AuthController } from "../../src/modules/auth/auth.controller";
import { AuthService } from "../../src/modules/auth/auth.service";
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { Payload } from "../../src/modules/auth/payload.type";
import { UserService } from "../../src/modules/user/user.service";
import { RegisterDTO } from "../../src/modules/auth/auth.dto";
import { User } from "../../src/modules/user/user.entity";

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
    
    

})