
export interface PageDto<T> {
    readonly items: T[];
    readonly meta: PageMetaDto;
}

export interface PageMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
}