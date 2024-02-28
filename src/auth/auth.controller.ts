import { Body, Controller, ExecutionContext, Get, Headers, Post, Req } from '@nestjs/common';
import { LoginAdminDto, LoginUserDto, RegisterUserDto } from './auth.interface';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../common/base/base.controller';
import { Request } from 'express';
import { SuccessResponse } from '../common/helpers/response';

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController extends BaseController {
    constructor(private authService: AuthService) { super();}

    @ApiBody({ type: RegisterUserDto })
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ApiBody({ type: LoginUserDto })
    @Post('login')
    async login(@Body() loginAdminDto: LoginAdminDto) {
        try {
            const res = await this.authService.loginAdmin(loginAdminDto);
            return new SuccessResponse(res);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiBody({ type: LoginUserDto })
    @Post('login-user')
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        try {
            const res = await this.authService.loginUser(loginUserDto);
            return new SuccessResponse(res);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get('refresh-token')
    async refreshToken(@Req() req: Request) {
        try {
            const res = await this.authService.refreshToken(req);
            return new SuccessResponse(res)
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get('get-user-profile')
    async getUser(@Req() req: Request) {
        try {
            const res = await this.authService.getUser(req);
            return new SuccessResponse(res);
        } catch (error) {
            this.handleError(error);
        }
    }
}
