import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { Repository } from "typeorm";
import { SignDTO, DeleteSignDTO } from "./signature.dto";
import { Team } from "../team/team.entity";
import { User } from "../user/user.entity";

@Injectable()
export class SignatureService {
    constructor(
        @InjectRepository(Signature)
        private signatureRepository : Repository<Signature>,
    ){}

    private async validateUserAuth (){

    }

    // 등록
    async create( signDTO:SignDTO, userId:string ):Promise<Signature>{
        const { teamId, url, desc } = signDTO;

        const team = new Team();
        if( !teamId ) {
            team.id = null;
        } else {
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

    async findBySignId(id : string ):Promise<Signature>{
        return await this.signatureRepository.findOne( { id, isActive:true } );
    }

    // 삭제
    async delete(deletesignDTO :DeleteSignDTO){
        const { signatureId } = deletesignDTO;
        await this. signatureRepository.update( signatureId, {isActive : false} );
    }

}