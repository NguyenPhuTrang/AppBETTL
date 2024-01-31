import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { log } from 'console';

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    login(@Body() loginUserDto:LoginUserDto):Promise<any> {
        return this.authService.login(loginUserDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() {refresh_token}):Promise<any>{
        console.log('refresh token api')
        return this.authService.refreshToken(refresh_token);
    }
}
