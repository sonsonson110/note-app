import {PageOptionsDto} from "./page-options.dto";

export class PageMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;

    constructor(pageOptionsDto: PageOptionsDto, totalItems: number) {
        this.page = pageOptionsDto.page;
        this.limit = pageOptionsDto.limit;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
        this.hasNextPage = this.page < this.totalPages;
        this.hasPreviousPage = this.page > 1;
    }
}