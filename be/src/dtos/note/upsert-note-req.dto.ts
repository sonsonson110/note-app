import { Expose } from 'class-transformer'
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator'

export class UpsertNoteReqDto {
    @Expose()
    @IsOptional()
    @IsUUID()
    id?: string

    @IsOptional()
    @IsString()
    @Expose()
    @MaxLength(300)
    title: string = ''

    @IsOptional()
    @IsString()
    @Expose()
    content: string = ''

    @IsOptional()
    @IsBoolean()
    @Expose()
    isPublic: boolean = false

    @IsOptional()
    @Expose()
    @IsInt()
    @Min(1)
    version: number = 1

    @IsOptional()
    @Expose()
    @IsBoolean()
    pinned: boolean = false
}
