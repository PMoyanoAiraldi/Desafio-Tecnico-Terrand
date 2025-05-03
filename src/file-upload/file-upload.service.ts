import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { RecipesService } from 'src/recipes/recipes.service';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly recipesService: RecipesService,
    ) {}

    async uploadFile(
        file: Express.Multer.File, 
        entityType: 'recipes',
        entityId?: string
    ): Promise<{ imgUrl: string }> {
        if (!file || !file.buffer || !file.originalname) {
            throw new Error('El archivo proporcionado no es válido');
        }

        if (!['recipes'].includes(entityType)) {
            throw new Error('El tipo de entidad proporcionado no es válido');
        }

        if (!entityId) {
            throw new Error('El ID de la entidad es requerido');
        }

        const folder = this.getFolderForEntityType(entityType);
        console.log(`Folder generado para ${entityType}: ${folder}`);

        const url = await this.cloudinaryService.uploadFile(
            file.buffer,
            folder,
            file.originalname
        );
        console.log(`Archivo subido a ${url}`);

        switch (entityType) {
            case 'recipes': {
                const recipe = await this.recipesService.findOne(entityId);
                console.log("Receta encontrada:", recipe);

                if (!recipe) {
                    throw new Error('Receta no encontrada');
                }

                await this.recipesService.updateRecipes(entityId, {
                    ...recipe,
                    image: url,
                });

                break;
            }

            default:
                throw new Error('Entidad no soportada');
        }

        return { imgUrl: url };
    }

    async deleteFile(publicId: string): Promise<void> {
        try {
            await this.cloudinaryService.deleteFile(publicId);
        } catch (error) {
            console.error('Error al eliminar el archivo de Cloudinary:', error);
            throw new InternalServerErrorException('Error al eliminar el archivo de Cloudinary');
        }
    }

    private getFolderForEntityType(entityType: string): string {
        switch (entityType) {
            case 'recipes':
                return 'recipes';
            default:
                throw new Error('Tipo de entidad no compatible');
        }
    }
}
