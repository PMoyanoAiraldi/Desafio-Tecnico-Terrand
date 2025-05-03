import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "src/shared/shared.module";
import { User } from "src/users/users.entity";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwtStrategy";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        UsersModule, 
        PassportModule, 
        SharedModule, 
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        AuthService,
        JwtStrategy, 
    ],
    controllers: [AuthController],
})
export class AuthModule{}