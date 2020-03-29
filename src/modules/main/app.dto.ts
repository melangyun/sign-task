import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileDTO{
    @ApiProperty({
        description : "Team ID",
        type: String,
        nullable:true
    })
    readonly filepath: string
    
}