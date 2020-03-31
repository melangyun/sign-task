// import * as request from 'supertest';
// import { RegisterDTO, LoginDTO } from "../src/modules/auth/auth.dto";
// import { HttpStatus } from '@nestjs/common';;
// import { app } from './constants';
// import { CreateTeamDTO } from "../src/modules/team/team.dto";


// describe('TEAM', () => {

//     let loginToken: string;
//     const user = { id: "admin", password : "1234", nickname : "관리자"}
//     const team: CreateTeamDTO = { name : "teatTeam"};
    
//     it("should login" , () => {
    
//         return request(app)
//           .post("/auth/login")
//           .set("Accept", "application/json")
//           .send(user)
//           .expect(({body})=> {
//             expect(body.token).toBeDefined();
            
//             loginToken = body.token;
//             // console.log("loginToken : ",loginToken);
//             expect(body.payload.id).toEqual(user.id);
//             expect(body.payload.nickname).toEqual(user.nickname);
//             expect(body.payload.password).toBeUndefined();
//          })
//          .expect(HttpStatus.CREATED)
//         });

//     it('should add Team', () => {
//         return request(app)
//             .post("/team")
//             .set("Authorization", `Bearer ${loginToken}`)
//             .set("Accept", "application/json")
//             .send(team)
//             .expect(({body}) => {
//                 expect(body.teamId).toBeUndefined();
//                 expect(body.leader).toEqual(user.nickname);
//             })
//             .expect(HttpStatus.CREATED);
//     })


// });