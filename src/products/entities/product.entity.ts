import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '022f1aa0-c1fa-454b-b42e-d08dbf10ff09',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Aliqua irure esse incididunt consectetur Lorem laboris minim fugiat amet tempor veniam voluptate.',
        description: 'Product Description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product Slug - for SEO',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        default: 0,
        description: 'Product Stock',
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product Size',
    })
    @Column('text', {
        array: true,
    })
    sizes: string[]

    @ApiProperty({
        example: 'women',
        description: 'Product Gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['winter', 'cool'],
        default: [],
        description: 'Product Tags',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        example: ['https://image.jpg', 'https://image2.png'],
        description: 'Product Images',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.formatSlug();
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.formatSlug();
    }

    private formatSlug() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "");
    }
}
