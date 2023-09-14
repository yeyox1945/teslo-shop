import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        example: 'name@email.com',
        title: 'Email',
        description: 'Email to register',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Abc123',
        title: 'Password',
        description: 'Password with one uppercase, lowercase and numbers',
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example: 'Diego Vargas',
        title: 'Full name',
        description: 'Full name of the person registering',
    })
    @IsString()
    @MinLength(1)
    fullName: string;
}