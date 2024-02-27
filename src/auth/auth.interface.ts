import { JoiValidate } from "../common/decorators/validator.decorator";
import { INPUT_TEXT_MAX_LENGTH } from "../common/constants";
import { ApiProperty } from "@nestjs/swagger";
import Joi from "../plugins/joi";

export class LoginUserDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "abcdef@example.com",
    })
    @JoiValidate(Joi.string().trim().email().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '123456a@',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH))
    password: string;
}

export class LoginAdminDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "abcdef@example.com",
    })
    @JoiValidate(Joi.string().trim().email().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '123456a@',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH))
    password: string;
}

export class RegisterUserDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'user@example.com',
    })
    @JoiValidate(Joi.string().trim().email().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User birthday',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    birthday: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User numberPhone',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    numberPhone: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User avatar',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    avatar: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '123',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH))
    password: string;
}