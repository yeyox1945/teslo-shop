import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    @ApiProperty({
        title: 'Id',
        description: 'Id of the user',
        example: '274034c5-53bb-405b-9cdd-9af4c1d7abde',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        title: 'Email',
        description: 'Email of the created user',
        example: 'diego@google.com',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    email: string;

    @ApiProperty({
        title: 'Password',
        description: 'Encrypted password of the user',
        example: '$2b$10$JjxnNT3qpOCgNJzbPvO2euHiDHxNT3HWshm9/cPMyclOgR385rtRC',
    })
    @Column('text', {
        select: false,
    })
    password: string;

    @ApiProperty({
        title: 'Full Name',
        description: 'User full name',
        example: 'Diego Yael Vargas Becerra',
    })
    @Column('text')
    fullName: string;


    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @ApiProperty({
        isArray: true,
        title: 'Roles',
        description: 'Array of roles the user has',
        default: ['user'],
        example: ['user', 'admin'],
    })
    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
