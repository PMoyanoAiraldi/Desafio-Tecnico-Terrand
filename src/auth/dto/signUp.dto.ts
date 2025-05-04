import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignUpDto {

    @ApiProperty({
        type: String,
        description: "Nombre del usuario",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;


    @ApiProperty({
        type: String,
        description: "Apellido del usuario",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    surname: string;

    @ApiProperty({
        type: String,
        description: "Email del usuario",
        required: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)",
        required: true,
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
        {
            message: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)"
        }
    )
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty({
        type: String,
        description: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)",
        required: true,
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
        {
            message: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)"
        }
    )
    @IsNotEmpty()
    @IsString()
    confirmPassword: string



    @ApiProperty({
        type: Boolean,
        description: "Estado del usuario",
        required: true,
    })
    @IsBoolean()
    state: boolean;
}
