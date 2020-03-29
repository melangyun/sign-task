import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO{
    @ApiProperty({
        description : "User ID",
        type: String,
    })
    readonly id: string;

    @ApiProperty({
        description : "User PW",
        type: String,
    })
    readonly password : string;
}

export class RegisterDTO{
    @ApiProperty({
        description : "The ID you want (unique)",
        type: String,
    })
    readonly id: string;

    @ApiProperty({
        description : "The PW you want",
        type: String,
    })
    readonly password: string;

    @ApiProperty({
        description : "The nickname you want",
        type: String,
    })
    readonly nickname : string;  
}