import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO{
    @ApiProperty({
        description : "User ID",
        default : "userId",
        type: String,
    })
    readonly id: string;

    @ApiProperty({
        description : "User PW",
        default : "password",
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
        default: "password",
        type: String,
    })
    readonly password: string;

    @ApiProperty({
        description : "The nickname you want",
        default : "swaggerUser",
        type: String,
    })
    readonly nickname : string;  
}