import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './auth.interface';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @ApiBody({type: RegisterUserDto})
    @Post('register')
    register(@Body() registerUserDto:RegisterUserDto):Promise<any> {
        return this.authService.register(registerUserDto);
    }

    @ApiBody({type: LoginUserDto})
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
