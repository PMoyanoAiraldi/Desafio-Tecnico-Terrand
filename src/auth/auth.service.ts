import {  ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "./dto/signUp.dto";
import { SigInDto } from "./dto/signIn.dto";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async signUp(signUp: SignUpDto): Promise<User>{
        try{
        
        if(signUp.password !== signUp.confirmPassword){
            throw new HttpException('Las contraseñas no coinciden', 400)
        }

        // Verificar si el correo ya existe
        const existingUser = await this.usersRepository.findOne({ where: { email: signUp.email } });
        if (existingUser) {
            throw new HttpException('El email ya está registrado', 400);
        }

        // Crear una nueva instancia de usuario
        const newUser = new User();
        Object.assign(newUser, signUp);// Asignar los datos del DTO al nuevo usuario
        console.log('Usuario antes de guardar:', newUser);

        
        const hashedpassword = await bcrypt.hash(signUp.password, 10);
        newUser.password = hashedpassword;// Asignar la contraseña encriptada al nuevo usuario
        console.log('Hashed contrasena:', newUser.password);

        return this.usersRepository.save(newUser)
        
    } catch (error) {
            console.error('Error al crear el usuario:', error);
            if (error instanceof HttpException) {
                throw error; 
            }
        }
        throw new HttpException('Error al crear el usuario', 500);
    }

    async signIn(signIn: SigInDto): Promise<{ user: Partial<User>, token: string }> {
        const user = await this.usersRepository.findOne({ 
            where: {email: signIn.email.toLowerCase()},
            
        });
        console.log('Email recibido en el sigIn:', signIn.email);
        console.log('Usuario encontrado:', user);


        if (!user) {
            throw new HttpException('Email o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }
    
        // Verificar si el usuario está habilitado
        if (!user.state) {
            throw new ForbiddenException('Tu cuenta está suspendida. Contacta al administrador.');
        }

        const matchPassword = user && await bcrypt.compare(signIn.password, user.password);

        console.log('Contraseña recibida en el login:',signIn.password);
        console.log('Contraseña coincide:', matchPassword);

        if (!matchPassword) {
            throw new HttpException('Email o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }


        const token = await this.createToken(user);
        
        // Elimina campos sensibles como password
        const { password, ...userWithoutPassword } = user;
        console.log(password)

        // Devuelve tanto el token como la información del usuario
        return {
            user: userWithoutPassword,
            token
        };
    }

    private createToken(usuario: User) {
        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };
        return this.jwtService.signAsync(payload)
    }



}
