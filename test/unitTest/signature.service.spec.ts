import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { User } from '../../src/modules/user/user.entity';
import { Team } from '../../src/modules/team/team.entity';
import { SignatureService } from '../../src/modules/signature/signature.service';


describe("TeamService", () => {

    let signatureService:SignatureService;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [TestModule]
        })
        .compile();
        
        signatureService = module.get<SignatureService>(SignatureService);
        
      });

   

})