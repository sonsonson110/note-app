import {IsInt, IsOptional, Min} from 'class-validator';

export class PageOptionsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    readonly limit: number = 10;

    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}