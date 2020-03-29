import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Payload } from './payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_ACCESS,
    });
  }

  async validate(payload: Payload, done: VerifiedCallback) {
    const user = await this.authService.validateUser(payload);
    return done(null, user, payload.iat);
  }
}