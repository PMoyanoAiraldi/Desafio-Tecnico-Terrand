import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryService } from './cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from 'src/recipes/recipes.entity';




@Module({
  imports: [TypeOrmModule.forFeature([Recipes])],
  providers: [FileUploadService, CloudinaryService],
  controllers: [],
  exports: [FileUploadService,  CloudinaryService]
})

export class FileUploadModule {}
