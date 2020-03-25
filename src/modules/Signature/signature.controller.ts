import { Controller } from "@nestjs/common";
import { SignatureService } from "./signature.service";

@Controller("signature")
export class SignatureController{
    constructor(private readonly signatureService : SignatureService){}
}