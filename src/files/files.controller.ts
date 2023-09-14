import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('product/:imageName')
  @ApiParam({ name: 'imageName', description: 'Image name to show', example: '7652426-00-A_0_2000.jpg' })
  @ApiResponse({ status: 200, description: 'Image get successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findProductImage(
    @Res() res: Response, // Handle Response manually without Nest
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }))
  @ApiResponse({ status: 201, description: 'Image uploaded succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file)
      throw new BadRequestException('Make sure file is an image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }

}
