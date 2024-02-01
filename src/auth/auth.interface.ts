import { JoiValidate } from "@/common/decorators/validator.decorator";
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