import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateRecipesDto {
    
    @ApiProperty({
        type: String,
        description: "Titulo de la receta",
        required: true,
    })
    @IsString()
    @IsOptional()
    title?: string;


    @ApiProperty({
        type: String,
        description: "Descripción de la receta",
        required: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        type: String,
        description: "Ingredientes de la receta",
        required: true,
    })
    @IsString()
    @IsOptional()
    ingredients?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen del usuario',
        required: false,
    })
    @IsOptional()
    image?: any;

}