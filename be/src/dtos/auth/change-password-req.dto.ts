import {IsString, MaxLength, MinLength} from "class-validator";

export class ChangePasswordReqDto {
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    oldPassword!: string

    @IsString()
    @MinLength(6)
    @MaxLength(255)
    newPassword!: string
}