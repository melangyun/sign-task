import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from "../../types/user.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate( login: Login): Promise<any> {
    const user = await this.authService.validateUser(login);
    if (!user) {
      console.log("살려줫");
      throw new UnauthorizedException();
    }
    return user;
  }
}