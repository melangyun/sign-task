import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signature } from "./signature.entity";
import { Repository } from "typeorm";

@Injectable()
export class SignatureService {
    constructor(
        @InjectRepository(Signature)
        private signatureRepository : Repository<Signature>,
    ){}

}