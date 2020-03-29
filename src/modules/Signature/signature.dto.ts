import { ApiProperty } from '@nestjs/swagger';

export class SignDTO{
    @ApiProperty({
        description : "Team ID",
        type: String,
        nullable:true
    })
    readonly teamId: string
    
}