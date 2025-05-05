import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseRecipesDto } from './dto/response-recipes.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipesDto } from './dto/create-recipes.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorators';
import { User } from 'src/users/users.entity';
import { UpdateRecipesDto } from './dto/update-recipes.dto';
import { Recipes } from './recipes.entity';


@ApiTags("Recipes ")
@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}


    @Post()
    @ApiOperation({ summary: 'Crear una nueva receta' })
    @ApiResponse({ status: 201, description: 'Receta creada', type: ResponseRecipesDto })
    @ApiResponse({ status: 400, description: 'La categoría ya existe.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para crear la receta, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                description: {type: 'string'},
                ingredients: {type: 'string'},
                image: { type: 'string', format: 'binary'},
                
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() createRecipesDto: CreateRecipesDto,@AuthUser() user: User,  @UploadedFile() file?: Express.Multer.File): Promise<ResponseRecipesDto> {
        const newRecipes = await this.recipesService.createRecipes(createRecipesDto,user.id, file);
        return newRecipes;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Modificar una receta' })
    @ApiResponse({ status: 201, description: 'Receta modificada', type: UpdateRecipesDto })
    @ApiResponse({ status: 404, description: 'Receta no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para actualizar la receta, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                description: {type: 'string'},
                ingredients: {type: 'string'},
                image: { type: 'string', format: 'binary'},
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string, 
        @Body() updateRecipesDto: UpdateRecipesDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Recipes> {
        
        return await this.recipesService.updateRecipes(id, updateRecipesDto, file);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas las recetas' })
    @ApiResponse({ status: 200, description: 'Lista de recetas', type: [Recipes] })
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<Recipes[]> {
        return this.recipesService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Obtener una receta por ID' })
    @ApiResponse({ status: 200, description: 'Receta encontrada', type: Recipes })
    @ApiResponse({ status: 404, description: 'Receta no encontrada' })
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<Recipes> {
        return this.recipesService.findOne(id);
    }

    

}