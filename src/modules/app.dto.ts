import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileDTO{
    @ApiProperty({
        description : "File name with extension",
        type: String,
        nullable:true
    })
    readonly filename: string
    
}