import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository, } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { Repository, UpdateResult } from "typeorm";
import { SignDTO } from "./signature.dto";
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
    
    // 팀의 존속 여부와 권한 확인
    async validateUserAuth (teamId:number, userId:string, inquiry:string):Promise<void>{
        await this.teamService.verifyTeam(teamId);
        const teamUser:TeamUser = await this.teamService.getTeamUser(teamId, userId);
        if ( !teamUser || ( teamUser && !teamUser.auth[inquiry]) ){
            throw new HttpException('Invalid access', HttpStatus.FORBIDDEN );
        }
    }

    // 등록
    async create( signDTO:SignDTO, userId:string ):Promise<string> {
        const { teamId, url, desc } = signDTO;
        
        const team = new Team();
        team.id = teamId || null;

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
    // 서명 아이디로 서명 권한 확인 - private method
    async validateSignId( signId:string, userId:string, key:string ):Promise<object> {
        const rowDataPacket:Array<any> =  await this.signatureRepository.
            query(`select * from signature where is_active = true and id = "${signId}"`)
    
        const sign:any = rowDataPacket[0];

        if( !sign ){
            // 일단 서명을 꺼내고, 없으면 키가 일치하지 않음을 알림
            throw new HttpException('Invalid signature key', HttpStatus.NOT_FOUND );
        }

        if( sign.teamId ){ 
            // 팀에 등록된 팀 서명 이라면, 팀 권한 조회를 함!
            await this.validateUserAuth(sign.teamId , userId, key );
        } else if ( sign.userId !== userId ) {
            // 개인의 서명이라면, 본인이 등록한 서명이 맞는지 검사함 
            throw new HttpException('Invalid access', HttpStatus.FORBIDDEN );
        }

        return sign;
    }

    // 서명 아이디로 서명 삭제
    async delete(signatureId :string):Promise<string>{
        const result:UpdateResult =  await this. signatureRepository.update( signatureId, {isActive : false} );
        return result.raw.message;
    }

    // 사인(들)을 가져오는 method - 팀과 개인 공용!
    async getSigns(userId:string, teamId:number|null):Promise<Signature[]>{
        const user = new User();
        user.id = userId;

        const team = new Team();
        team.id = teamId;

        return await this.signatureRepository.find( { user, isActive:true, team});
    }

}