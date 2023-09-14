import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

    @ApiProperty({
        title: 'Email',
        description: 'Email of the user',
        example: 'user@email.com',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        title: 'Password',
        description: 'Password of the user with at least one Uppercase, lowercase and numbers',
        example: 'Abc123',
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
}