import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDbExceptions(error);
    }

  }


  // TODO: paginar
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });

    return products;
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const query = this.productRepository.createQueryBuilder();

      product = await query
        .where(`LOWER(title) = :title or slug = :slug`, {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with id, slug or title "${term}" not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) throw new NotFoundException(`Product with id "${id}" not found`);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDbExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }


  private handleDbExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
