import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, 
    private readonly usersService: UsersService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request: Request = context.switchToHttp().getRequest() 
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException('El token no fue encontrado')
    }

    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') 
      });
      const user = await this.usersService.getUserForId(payload.sub); //  Trae el usuario de la DB

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request['user'] = user
      // payload.iat = new Date(payload.iat * 1000)
      // payload.exp = new Date(payload.exp * 1000)
      console.log('user', user) 
    }catch(err){
      console.error(err);
      throw new UnauthorizedException('Token invalido')
    }
    return true
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}