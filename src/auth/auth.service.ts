import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from 'global/user/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from 'shared/configuration/configuration.service';
import { Configuration } from 'shared/configuration/configuratio.enum';
import * as conf from '../../config/default';
import { AuthInterfaces } from './interfaces/auth.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignupDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {
    static expired: number | string;
    username = process.env.SMTP_USERNAME;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly _configurationService: ConfigurationService
        // @Inject('MailerProvider') private readonly mailerProvider
    ) {
        AuthService.expired = _configurationService.get(Configuration.JWT_EXPIRED);
    }

    async createToken(id: number, username: string) {
        let image_url = '';
        let image_path = '';
        const empData = await this.userService.getUserById(id);
        const images = ''
        const full_name = `${empData.first_name} ${empData.last_name}`;
        const today = new Date()
        today.setSeconds(today.getSeconds() + conf.default.DAILY_EXPIRED)

        if (images) {
            // image_path = images.PATH_LOCATION + '' + images.FILE_NAME;
            // image_url = image_path;
        }
        const user: AuthInterfaces = {
            id,
            username,
            full_name,
            image_url,
            daily_exp: conf.default.DAILY_EXPIRED,
            daily_date: today
        };
        const accessToken = this.jwtService.sign(user);
        console.log(accessToken)
        return {
            expiresIn: AuthService.expired,
            accessToken,
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        if (payload && payload.username) {
            const user = await this.userService.getUser(payload.id, payload.username);
            // const role = await this._roleAssign.getAssigns(payload.id);
            // const user = '';
            const role = '';
            return await {
                user,
                assign: role,
            };
        }
        return {};
    }

    async createUser(data: SignupDTO) {
        const dataUser = await this.userService.signup(data);
        console.log(dataUser)
        if (!dataUser.error_bit) {
            return this.createToken(dataUser.result.user_id, dataUser.result.email)
        } 
        return dataUser.result
    }
}
