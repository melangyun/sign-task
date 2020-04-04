import { AppService } from "../../src/modules/app.service";

describe("AppController", () => {
    let appService:AppService;
    
    beforeEach(()=>{
        appService = new AppService();
    });

    describe("say Hello!", () => {
        it("should return 'Hello World'", () => {
            
            const spyFn = jest.spyOn(appService, "getHello")
            const result = appService.getHello();

            expect(spyFn).toBeCalledTimes(1);
            expect(spyFn).toBeCalledWith();
            expect(result).toBe('Hello World!');

        });
    });

})