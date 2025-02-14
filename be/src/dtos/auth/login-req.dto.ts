import {IsString, MaxLength, MinLength} from "class-validator";

export class LoginReqDto {
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    username!: string

    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password!: string
}