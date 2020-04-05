import { ApiProperty } from '@nestjs/swagger';

export class SignDTO{
    @ApiProperty({
        description : "Team ID",
        type: Number,
        nullable:true
    })
    readonly teamId?: number;

    @ApiProperty({
        description : "file url",
        type: String,
    })
    readonly url : string;

    @ApiProperty({
        description : "simple description about signature",
        type: String,
    })
    readonly desc : string;
}


export class DeleteSignDTO{
    @ApiProperty({
        description : "Signature ID",
        type: String,
    })
    readonly signatureId: string;
}