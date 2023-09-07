import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min, isPositive } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enable ImplicitConversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) // enable ImplicitConversions: true
    offset?: number;
}