import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Recipes } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateRecipesDto } from './dto/create-recipes.dto';
import { CloudinaryService } from 'src/file-upload/cloudinary.service';
import { UpdateRecipesDto } from './dto/update-recipes.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecipesService {

    constructor( 
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly usersService: UsersService
    ){}

        async createRecipes(createRecipesDto: CreateRecipesDto, userId: string, file?: Express.Multer.File): Promise<Recipes> {
            try{
        
            const existingRecipe = await this.recipesRepository.findOne({where: {title: createRecipesDto.title}} );

            if (existingRecipe) {
                throw new HttpException(
                    `La receta con título '${createRecipesDto.title}' ya existe.`, HttpStatus.BAD_REQUEST)
            }
        
            let imageUrl: string | undefined;
                if(file){
                try {
                    // Subir la imagen a Cloudinary y obtener la URL
                    imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'recipes', file.originalname);
                    console.log('Archivo subido a URL:', imageUrl);
                } catch (error) {
                    console.error('Error al subir la imagen a Cloudinary:', error);
                    throw new InternalServerErrorException('Error al subir la imagen');
                }
            }

            const user = await this.usersService.getUserForId(userId);
    
            if (!user) {
                throw new NotFoundException('Usuario no encontrado');
            }
        


            // Si no existe, crea y guarda la nueva receta
            const recipes = this.recipesRepository.create({
                ...createRecipesDto, // Asegúrate de guardar el nombre normalizado
                image: imageUrl,
                user
            });
        
            console.log("Receta antes de ser guardada", recipes)
        
            return await this.recipesRepository.save(recipes);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                // Error de unicidad detectado (código específico de PostgreSQL)
                throw new HttpException(
                    'Ya existe una receta con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            // Si el error no es de unicidad, lánzalo tal como está
            throw error;
        }
            }

    async updateRecipes(id: string, updateRecipesDto: UpdateRecipesDto, file?: Express.Multer.File): Promise <Recipes>{
        const recipes = await this.recipesRepository.findOne({ where: { id } });
        if (!recipes) {
        throw new NotFoundException(`Receta con ID ${id} no encontrada`);
        } 

        // Si no se proporciona ningún dato válido, lanzar un error
        if (!updateRecipesDto.title && !updateRecipesDto.description && !updateRecipesDto.ingredients &&!file) {
            throw new BadRequestException('No se proporcionaron datos para actualizar la receta.');
        }
        
        // Verificar si el titulo ya existe en otra receta
        if (updateRecipesDto.title) {
            const normalizedTitle = updateRecipesDto.title.trim().toLowerCase();// Normaliza a minúsculas
            // Buscar si ya existe otra receta con el mismo titulo (ignorando mayúsculas)
            const existingRecipes= await this.recipesRepository.findOne({
                where: { title: normalizedTitle},
            });
            if (existingRecipes && existingRecipes.id !== id) {
                throw new BadRequestException(`El titulo de la receta "${updateRecipesDto.title}" ya existe`);
            }

            // Verificar si el nombre propuesto es igual al actual al normalizarlo
            if (recipes.title.toLowerCase() === normalizedTitle) {
                throw new BadRequestException(`El titulo de la receta "${updateRecipesDto.title}" ya existe`);
            }

            // Asignar el titulo normalizado
            recipes.title = updateRecipesDto.title.trim();
        }
        
        if (updateRecipesDto.description) {
            recipes.description = updateRecipesDto.description.trim();
        }
        
        if (updateRecipesDto.ingredients) {
            recipes.ingredients = updateRecipesDto.ingredients.trim();
        }
        
            if (file) {
                    // Eliminar la imagen anterior si existe
                    console.log('Archivo recibido en el servicio:', file);
                    if (recipes.image) {
                        try {
                        await this.cloudinaryService.deleteFile(recipes.image);
                    } catch (error) {
                    console.error('Error al manejar la imagen:', error);
                    throw new InternalServerErrorException('Error al manejar la imagen');
                }
            }

                try{
                    // Subir la nueva imagen
                    const newImageUrl = await this.cloudinaryService.uploadFile(
                        file.buffer,
                        'recipes',
                        file.originalname,
                    );
                    recipes.image = newImageUrl; // Asignar la nueva URL de la imagen
                } catch (error) {
                    console.error('Error al subir la nueva imagen:', error);
                    throw new InternalServerErrorException('Error al subir la nueva imagen');
                }
            }

        try {
            return await this.recipesRepository.save(recipes);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                    'Ya existe una recetas con ese titulo.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw error;
    }
}
    

    async findOne(id: string): Promise<Recipes> {
        const recipes = await this.recipesRepository.findOne({ where: { id } });
        if (!recipes) {
            throw new NotFoundException(`Receta con ID ${id} no encontrada`);
        }
        return recipes;
    }

    async findAll(): Promise<Recipes[]> {
        return await this.recipesRepository.find();
    }

}
