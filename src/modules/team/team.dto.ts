import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDTO{
    // @ApiProperty({
    //     description: 'The age of a cat',
    //     minimum: 1,
    //     default: 1,
    //   })

    @ApiProperty()
    readonly name: string;
}

export class DeleteTeamDTO{
    @ApiProperty()
    readonly teamId : number;
}

export class AddUserDTO{
    @ApiProperty()
    readonly teamId : number;

    @ApiProperty()
    readonly memberId : string;
}

export class ModifyPermissionDTO{
    @ApiProperty()
    readonly teamId : number;

    @ApiProperty()
    readonly memberId : string;

    @ApiProperty()
    readonly auth : { "lookup": boolean, "add": boolean, "delete": boolean}
}
