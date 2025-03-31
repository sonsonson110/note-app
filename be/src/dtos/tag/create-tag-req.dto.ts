import { IsString, IsUUID, MinLength } from 'class-validator'

export class CreateTagReqDto {
    @IsUUID()
    noteId!: string
    @IsString()
    @MinLength(1)
    tagName!: string
}
