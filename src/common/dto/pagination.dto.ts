import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'How many items do you need',
        example: 5,
        required: false,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enable ImplicitConversions: true
    limit?: number;

    @ApiProperty({
        default: 10,
        minimum: 0,
        description: 'How many items you want to skip',
        example: 5,
        required: false,
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number) // enable ImplicitConversions: true
    offset?: number;
}