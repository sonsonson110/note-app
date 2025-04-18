import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { PageOptionsDto } from '../common/page-options.dto'

export class NoteListReqDto extends PageOptionsDto {
    @IsOptional()
    @IsBoolean()
    readonly pinned: boolean = false

    @IsOptional()
    @IsBoolean()
    readonly isDeleted: boolean = false

    @IsOptional()
    @IsString()
    readonly searchKeyword = ''
}
