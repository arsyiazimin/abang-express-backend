import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as md5 from 'md5';
import { Repository, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin } from "../../../user-login/entity/userLogin.entity";
import { SignupDTO } from 'auth/dto/signup.dto';
import { User } from 'global/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { PasswordHasherService } from '../hasher/password-hasher/password-hasher.service';
// import { AuthService } from 'auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserLogin) private readonly userRepository: Repository<UserLogin>,
        @InjectRepository(User) private readonly UserRepository: Repository<User>,
        private passwordHasher: PasswordHasherService,
        // private authService: AuthService
    ) { }

    async signup(data: SignupDTO): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();
        let result: any;
        await queryRunner.startTransaction();
        try {
            const hasPassword = this.passwordHasher.hasPassword(data.password);
            let dataReady = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                status_id: 1,
                user_login: {
                    status_id: 1,
                    login_code: data.email,
                    login_pass: (await hasPassword).LOGIN_PASS,
                    s_pass: (await hasPassword).SPASS,
                    is_dev: 0
                }
            }
            const main = await this.UserRepository.create(dataReady);

            /* Action Save */
            await queryRunner.manager.save(main).then(async res => {
            }).catch(async err => {
                throw new Error(err);
            });

            console.log(main)
            // await queryRunner.rollbackTransaction();
            await queryRunner.commitTransaction();
            result = { result: main, error_bit: false }
        } catch (error) {
            console.log(error.message)
            await queryRunner.rollbackTransaction();
            result = { result: error.message, error_bit: true }
        } finally {
            await queryRunner.release();
        }
        return result
    }

    async adminUser() {
        const result = this.userRepository.find({ user_id: 1 });
        return result;
    }

    async getUserByUsername(username: string): Promise<UserLogin> {
        username = username.toLowerCase();
        const user = await getManager()
            .createQueryBuilder(UserLogin, "user")
            .leftJoinAndSelect("User", "emp", 'emp.user_id = user.user_id')
            .where("LOWER(user.login_code) = :emp_username AND user.status_id = :status_id", { emp_username: username, status_id: 1 })
            .getOne();
        return user;
    }

    async getUser(user_id: number, username: string): Promise<UserLogin> {
        username = username.toLowerCase();
        const user = await getManager()
            .createQueryBuilder(UserLogin, "user")
            .leftJoinAndSelect("User", "emp", 'emp.user_id = user.user_id')
            .where("user.user_id = :user_id AND LOWER(user.LOGIN_CODE) = :emp_username AND user.STATUS_ID = :status_id", { user_id: user_id, emp_username: username, status_id: 1 })
            .getOne();
        return user;
    }

    async getUserById(user_id: number): Promise<User> {
        return await this.UserRepository.findOne({ where: { user_id: user_id, status_id: 1 } });
    }
}
