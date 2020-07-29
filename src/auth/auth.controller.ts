import { Controller, Post, UseInterceptors, Body, Response, HttpStatus } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'global/user/services/user/user.service';
import { LoggingInterceptor } from '../common/interceptors/logging/logging.interceptor';
import { LoginUserDto, LoginUserMobileDto } from './dto/loginUser.dto';
import { HashDto } from './dto/hash.dto';
import { SignupDTO } from './dto/signup.dto';
import { PasswordHasherService } from 'global/user/services/hasher/password-hasher/password-hasher.service';
import { AbangExpressService } from 'global/abang-express/abang-express.service';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly passwordHasher: PasswordHasherService,
        private readonly abangExpressService: AbangExpressService
    ) { }

    @Post('login')
    @UseInterceptors(new LoggingInterceptor())
    async loginUser(@Response() res: any, @Body() body: LoginUserDto) {
        if (!body && body.email && body.password) {

            return res
                .status(HttpStatus.OK)
                .json({ message: 'Username and Password are Required!' });
        }
        console.log(body.email);
        const UserAdmin = await this.userService.adminUser();
        if (body.email.indexOf(UserAdmin[0].login_code) > 0) {
            var email = await body.email.replace('.' + UserAdmin[0].login_code, '');
            var admin = 1;
        } else {
            var email = await body.email;
            var admin = 0;
        }
        const user = await this.userService.getUserByUsername(email);

        if (user) {
            if (
                await this.passwordHasher.compareHash(
                    body.password,
                    admin == 0 ? user.login_pass : UserAdmin[0].login_pass,
                    admin == 0 ? user.s_pass : UserAdmin[0].s_pass,
                )
            ) {
                return res
                    .status(HttpStatus.OK)
                    .json(
                        await this.authService.createToken(user.user_id, user.login_code),
                    );
            }
        }

        return res
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({ message: 'Username or Password Wrong!!' });
    }

    @Post('signup')
    async signup(@Body() body: SignupDTO) {
        return await this.authService.createUser(body)
        // return await this.userService.signup(body)
    }

    @Post('login-mobile')
    @UseInterceptors(new LoggingInterceptor())
    async loginMobileUser(@Response() res: any, @Body() body: LoginUserMobileDto) {
        if (!body && body.username && body.password) {

            return res
                .status(HttpStatus.OK)
                .json({ message: 'Username and Password are Required!' });
        }
        console.log(body.username);
        const user = await this.abangExpressService.getUserByUsername(body.username);

        if (user) {
            if (
                await this.passwordHasher.compareMd5(
                    body.password,
                    user.password,
                )
            ) {
                return res
                    .status(HttpStatus.OK)
                    .json(
                        await this.authService.createTokenMobile(user.username),
                    );
            }
        }

        return res
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({ message: 'Username or Password Wrong!!' });
    }
}
