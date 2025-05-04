import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('recipes')
export class Recipes {
    @ApiProperty({
        type: String,
        description: "Identificador único de la receta",
        required: true,
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        type: String,
        description: "Titulo de la receta",
        required: true,
    })
    @Column({ length: 60 })
    title: string;


    @ApiProperty({
        type: String,
        description: "Descripción de la receta",
        required: true,
    })
    @Column({ length: 500 })
    description: string;

    @ApiProperty({
        type: String,
        description: "Ingredientes de la receta",
        required: true,
    })
    @Column({ length: 500, })
    ingredients: string;

    @ApiProperty({
        type: String,
        description: "URL de la imagen de la receta",
        required: true
    })
    @Column({ nullable: true })
    image?: string

    @ManyToOne(() => User, (user) => user.recipes)
    @JoinColumn({ name: 'userId' }) 
    user: User


    @ApiProperty({
        type: Boolean,
        description: "Estado de la receta",
        required: true,
    })
    @Column({ default: true })
    state: boolean;
}
