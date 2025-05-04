import { ApiProperty } from "@nestjs/swagger";
import { Recipes } from "src/recipes/recipes.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum rolEnum {
    ADMIN = 'admin',
    CLIENTE = 'cliente',
}


@Entity('users')
export class User {
    @ApiProperty({
        type: String,
        description: "Identificador único del usuario",
        required: true,
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        type: String,
        description: "Nombre del usuario",
        required: true,
    })
    @Column({ length: 60 })
    name: string;


    @ApiProperty({
        type: String,
        description: "Apellido del usuario",
        required: true,
    })
    @Column({ length: 60 })
    surname: string;

    @ApiProperty({
        type: String,
        description: "Email del usuario",
        required: true,
    })
    @Column({ length: 60, unique: true, nullable: false })
    email: string;

    @ApiProperty({
        type: String,
        description: "Contraseña del usuario",
        required: true
    })
    @Column({ nullable: true })
    password: string

    @Column({
        type: 'enum',
        enum: rolEnum,
        default: rolEnum.CLIENTE,
    })
    rol: rolEnum; 


    @OneToMany(() => Recipes, (recipes) => recipes.user)
    recipes: Recipes[]


    @ApiProperty({
        type: Boolean,
        description: "Estado del usuario",
        required: true,
    })
    @Column({ default: true })
    state: boolean;
}
