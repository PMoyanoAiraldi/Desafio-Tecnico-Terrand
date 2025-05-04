import { Body, Controller, Post,  } from "@nestjs/common";
import {  ApiBody, ApiOperation, ApiResponse , ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { SigInDto } from "./dto/signIn.dto";





@ApiTags("Auth ")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp')
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: SignUpDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear el usuario' })
    @ApiBody({
        description: 'Datos para registrar el usuario',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                surname: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                confirmPassword: { type: 'string' },
            },
        },
    })
    async signUp(@Body() signUp: SignUpDto) {
        const user = await this.authService.signUp(signUp)

        return {
            message: `Usuario creado exitosamente`,
            user
        };
    }


    @Post('sigIn')
    @ApiOperation({ summary: 'Loguear un usuario' })
    @ApiResponse({ status: 201, description: 'Usuario logueado exitosamente', type: SigInDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al loguear el usuario' })
    @ApiBody({
            description: 'Datos para iniciar sesion',
            schema: {
                type: 'object',
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
            },
})
    async signIn(@Body() signInDto: SigInDto) {
        const {user, token} = await this.authService.signIn(signInDto);
    
        return {
            user,
            token,  
        };
    }

//     @Post('logout')
//     @UseGuards(AuthGuard)
//     @ApiSecurity('bearer')
//     async logout(@Req() req: AuthenticatedRequest) {
//         const userId = req.user?.id;
//         if (typeof userId !== 'number') {
//             throw new Error('Invalid or missing user ID');
//         }

//         return this.authService.logout(userId);
// }
//     @Put('reset-password')
//     async resetPassword(@Body() resetDto: ResetPasswordDto) {
//     return this.authService.resetPassword(resetDto);
//     }

}
