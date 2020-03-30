import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository, } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { Repository, UpdateResult } from "typeorm";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { Team } from "../team/team.entity";
import { User } from "../user/user.entity";
import { TeamService } from "../team/team.service";
import { TeamUser } from "../team/teamuser.entity";

@Injectable()
export class SignatureService {
    constructor(
        @InjectRepository(Signature)
        private signatureRepository : Repository<Signature>,
        private teamService : TeamService
    ){}
    
    // 권한 확인
    private async validateUserAuth (teamId:number, userId:string, inquiry:string):Promise<void>{
        const teamUser:TeamUser = await this.teamService.getTeamUser(teamId, userId);
    
        if ( !teamUser || ( teamUser && !teamUser.auth[inquiry]) ){
            throw new HttpException('Unvalid access', HttpStatus.NOT_ACCEPTABLE );
        }
    }

    // 등록
    async create( signDTO:SignDTO, userId:string ):Promise<string> {
        const { teamId, url, desc } = signDTO;
        
        const team = new Team();
        if( !teamId ) {
            team.id = null;   
        } else {
            await this.validateUserAuth(teamId, userId, "add" );
            team.id = teamId;
        }

        const user = new User();
        user.id = userId;

        const sign = new Signature();
        sign.user = user;
        sign.team = team;
        sign.url = url;
        sign.desc = desc;

        const registeredSign:Signature =  await this.signatureRepository.save(sign);
        return registeredSign.id;
    }
    // 0de8dc8d-69d1-481d-a307-0063b5ac2113
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QwMiIsIm5pY2tuYW1lIjoi7YWM7Iqk7Yq47Jyg7KCAIiwiaWF0IjoxNTg1NTE1OTU3LCJleHAiOjE1ODU2MDIzNTd9.OqZxvhdPMijDy_Bb8gIJaWuXPiWxrST_VKercSR84PM
    // 서명 아이디로 서명 권한 확인 - private method
    private async validateSignId( signId:string, userId:string, key:string ):Promise<object> {
        const rowDataPacket:Array<any> =  await this.signatureRepository.
            query(`select * from signature where is_active = true and id = "${signId}"`)
    
        const sign:any = rowDataPacket[0];

        if( !sign ){
            throw new HttpException('Invalid signature key', HttpStatus.BAD_REQUEST );
        }

        if( sign.teamId ){ 
            await this.validateUserAuth(sign.teamId , userId, key );
        } 
        else if ( sign.userId !== userId ) {
            throw new HttpException('Unvalid access', HttpStatus.NOT_ACCEPTABLE );
        }

        return sign;
    }

    async findBySignId(signId : string, userId:string ):Promise<Signature>{
        const sign:any = this.validateSignId(signId , userId, "lookup" );
        return sign;
    }

    // 서명 아이디로 서명 삭제
    async delete(deletesignDTO :DeleteSignDTO, userId : string):Promise<string>{
        const { signatureId } = deletesignDTO;
        await this.validateSignId(signatureId, userId , "delete" );
        const result:UpdateResult =  await this. signatureRepository.update( signatureId, {isActive : false} );
        return result.raw.message;
    }

    // 사인(들)을 가져오는 method
    private async getSigns(userId:string, teamId:number|null):Promise<Signature[]>{
        const user = new User();
        user.id = userId;

        const team = new Team();
        team.id = teamId;

        return await this.signatureRepository.find( { user, isActive:true, team});
    }

    // 유저 서명 반환
    async getUserSigns(id : string ):Promise<Signature[]>{
        return await this.getSigns(id, null);
    }

    // 팀 서명 반환
    async geTeamSigns(teamId : number ,userId : string):Promise<Signature[]>{
        await this.validateUserAuth(teamId, userId, "lookup");
        return await this.getSigns(userId, teamId);
    }

}