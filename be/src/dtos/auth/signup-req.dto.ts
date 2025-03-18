import {IsEmail, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class SignupReqDto {
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    username!: string

    @IsString()
    @IsEmail()
    @IsOptional()
    @MinLength(6)
    @MaxLength(100)
    email?: string

    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password!: string
}