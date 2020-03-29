import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { Repository } from "typeorm";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { Team } from "../team/team.entity";
import { User } from "../user/user.entity";
import { TeamService } from "../team/team.service";

@Injectable()
export class SignatureService {
    constructor(
        @InjectRepository(Signature)
        private signatureRepository : Repository<Signature>,
        private teamService : TeamService
    ){}
    
    // 권환 확인
    private async validateUserAuth (teamId:number, userId:string, inquiry:string):Promise<void>{
        const { auth } = await this.teamService.getTeamUser(teamId, userId);
        if ( !auth[inquiry] ){
            throw new HttpException('Unvalid access', HttpStatus.NOT_ACCEPTABLE );
        }
    }

    // 등록
    async create( signDTO:SignDTO, userId:string ):Promise<Signature> {
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

        return await this.signatureRepository.save(sign);
    }

    // 서명 아이디로 서명 정보 가져오기
    async findBySignId(id : string ):Promise<Signature>{
        const sign:Signature =  await this.signatureRepository.findOne( { id, isActive:true } );
        console.log("sign : ",sign)
        if( sign.team ){ 
            await this.validateUserAuth(sign.team.id , id, "lookup" );
        }
        return sign;
    }

    // 서명 아이디로 서명 삭제
    async delete(deletesignDTO :DeleteSignDTO, userId : string){
        const { signatureId } = deletesignDTO;
        const sign:Signature = await this.signatureRepository.findOne( { id : signatureId, isActive:true } );
        if( sign.team ){
            await this.validateUserAuth(sign.team.id, userId, "delete" );
        }

        return await this. signatureRepository.update( signatureId, {isActive : false} );
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
        return await this.getSigns(userId, teamId);
    }

}