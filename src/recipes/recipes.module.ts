import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recipes } from "./recipes.entity";
import { RecipesService } from "./recipes.service";
import { RecipesController } from "./recipes.controller";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Recipes]), UsersModule],
    providers: [ RecipesService, CloudinaryService],
    controllers: [RecipesController],
    exports: [RecipesService]
})
export class RecipesModule{}