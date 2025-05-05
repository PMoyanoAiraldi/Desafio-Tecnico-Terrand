import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseRecipesDto {
    
    @ApiProperty({
        type: String,
        description: "Titulo de la receta",
        required: true,
    })
    @IsString()
    title: string;


    @ApiProperty({
        type: String,
        description: "Descripción de la receta",
        required: true,
    })
    @IsString()
    description: string;

    @ApiProperty({
        type: String,
        description: "Ingredientes de la receta",
        required: true,
    })
    @IsString()
    ingredients: string;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen del usuario',
    })
    image?: any;

}