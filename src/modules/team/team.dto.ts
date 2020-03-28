import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class CreateTeamDTO{
    @ApiProperty({
        description : "Name of team that wants to be created",
        type: String,
    })
    readonly name: string;
}

export class DeleteTeamDTO{
    @ApiProperty({
        description : "The team ID that wants to be deleted",
        type: Number,
    })
    readonly teamId : number;
}

export class AddUserDTO{
    @ApiProperty({
        description : "The ID of the team",
        type: Number,
    })
    readonly teamId : number;

    @ApiProperty({
        description : "User ID to add to the team",
        type: String,
    })
    readonly memberId : string;
}

export class ModifyPermissionDTO{
    @ApiProperty({
        description : "The ID of the team",
        type: Number,
    })
    readonly teamId : number;

    @ApiProperty({
        description : "User ID to add to the team",
        type: String,
    })
    readonly memberId : string;

    @ApiProperty({
        description : "Permission to change",
        type: Object,
        // properties : { "lookup": Boolean, "add": Boolean, "delete": Boolean}
    })
    readonly auth : { "lookup": boolean, "add": boolean, "delete": boolean}
}
