import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDTO{
    @ApiProperty()
    readonly name: string;
    
    @ApiProperty()
    readonly id : string;
}

export class DeleteTeamDTO{
    @ApiProperty()
    readonly teamId : string;
}

