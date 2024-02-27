import { Body, Controller, ExecutionContext, Get, Headers, Post, Req } from '@nestjs/common';
import { LoginAdminDto, LoginUserDto, RegisterUserDto } from './auth.interface';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../common/base/base.controller';
import { Request } from 'express';

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController extends BaseController {
    constructor(private authService: AuthService) { super();}

    @ApiBody({ type: RegisterUserDto })
    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto): Promise<any> {
        return this.authService.register(registerUserDto);
    }

    @ApiBody({ type: LoginUserDto })
    @Post('login')
    login(@Body() loginAdminDto: LoginAdminDto): Promise<any> {
        return this.authService.loginAdmin(loginAdminDto);
    }

    @ApiBody({ type: LoginUserDto })
    @Post('login-user')
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.authService.loginUser(loginUserDto);
    }

    @Get('refresh-token')
    async refreshToken(@Req() req: Request) {
        return this.authService.refreshToken(req);
    }

    @Get('get-user-profile')
    async getUser(@Req() req: Request) {
        try {
            return await this.authService.getUser(req);
        } catch (error) {
            this.handleError(error);
        }
    }
}
