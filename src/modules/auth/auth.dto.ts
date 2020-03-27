import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO{
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly password : string;
}

export class RegisterDTO{
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly nickname : string;  
}