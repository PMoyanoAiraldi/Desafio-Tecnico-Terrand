import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import * as crypto from 'crypto';


@Injectable()
export class CloudinaryService {
    constructor(){
        dotenv.config({
            path: '.env'
        });
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadFile(buffer: Buffer, folder: string, originalName?: string): Promise<string>{
        const cleanFileName = originalName
        ? originalName.replace(/[^a-zA-Z0-9_-]/g, '').split('.')[0] // Limpia el nombre
        : `file_${Date.now()}`; // Genera un nombre predeterminado si no se proporciona uno

        const uniqueId = crypto.randomBytes(4).toString('hex'); // ID único para evitar conflictos
        const fileExtension = originalName?.split('.').pop() || 'jpg'; 
        const publicId = `${folder}/${cleanFileName}_${uniqueId}.${fileExtension}`; // Public ID estructurado

        const options: UploadApiOptions = {
            folder, // Usamos la carpeta específica pasada como argumento
            public_id: publicId,//  ID único del archivo
            resource_type: 'auto' // Automáticamente detecta el tipo
        }

        try {
            const result = await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                    if (error) {
                        
                        reject(new Error(error.message || 'Error al subir a Cloudinary'));
                    } else {
                        resolve(result?.secure_url || '');
                    }
                });

                stream.write(buffer);
                stream.end();
            });

            return result ; // Retorna la URL segura
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            throw new InternalServerErrorException('Error al subir el archivo');
        }
    }

    private extractPublicId(imageUrl: string): string {
        const regex = /(?:https:\/\/res\.cloudinary\.com\/.*?\/)(.*?)(?=\?)/;
        const matches = imageUrl.match(regex);
        if (matches && matches[1]) {
            return matches[1];
        }
        throw new Error('No se pudo extraer el public_id');
    }

    async deleteFile(imageUrl: string): Promise<void> {
        const publicId = this.extractPublicId(imageUrl);
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === 'ok') {
                console.log(`Archivo con public_id ${publicId} eliminado exitosamente.`);
            } else {
                throw new Error(`Error al eliminar el archivo con public_id ${publicId}`);
            }
        } catch (error) {
            console.error('Error al eliminar el archivo de Cloudinary:', error);
            throw new InternalServerErrorException('Error al eliminar el archivo de Cloudinary');
        }
    }
}