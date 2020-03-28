import {
    CanActivate, ExecutionContext, HttpException, HttpStatus,Injectable,
  } from '@nestjs/common';
  import { TeamService } from "../modules/team/team.service";
import { Team } from '../modules/team/team.entity';

  @Injectable()
  export class LeaderGuard implements CanActivate {
    constructor(private teamService: TeamService) {}
  
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { user} = request;
        const { teamId } = request.body;
        const team:Team = await this.teamService.findTeamByTeamId(teamId);

       if( !team ){
        throw new HttpException("Unvalid teamId", HttpStatus.BAD_REQUEST);
       }

        if( !team.isActive ){
          throw new HttpException('Unable to access deleted team.', HttpStatus.NOT_ACCEPTABLE );
        }

        if ( user.id === team.leader ) {
            return true;
        }
  
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
  }
  