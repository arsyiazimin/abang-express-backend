import { Injectable, Inject, forwardRef, Res, HttpStatus } from '@nestjs/common';
import * as md5 from 'md5';
import { Repository, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin } from "../../../user-login/entity/userLogin.entity";
import { SignupDTO, updateUserDTO } from '../../../../auth/dto/signup.dto';
import { User } from '../../../../global/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { PasswordHasherService } from '../hasher/password-hasher/password-hasher.service';
import * as moment from 'moment';
import * as mkDir from "make-dir";
import * as move from "move-file";
import { unlinkSync, existsSync, mkdirSync, renameSync, mkdir, readFileSync, writeFileSync, copyFileSync, } from 'fs';
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

    async getUserId(user_id: number): Promise<UserLogin> {
        const user = await getManager()
            .createQueryBuilder(UserLogin, "user")
            .leftJoinAndSelect("User", "emp", 'emp.user_id = user.user_id')
            .where("user.user_id = :user_id AND user.status_id = :status_id AND emp.status_id = :status_id", { user_id: user_id, status_id: 1 })
            .getOne();
        return user;
    }

    async getUserById(user_id: number): Promise<User> {
        return await this.UserRepository.findOne({ where: { user_id: user_id, status_id: 1 } });
    }

    async updateUser(user_id: number, data: updateUserDTO, files: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();
        let result: any;
        let dataReady: any
        let resFile: any
        await queryRunner.startTransaction();
        try {
            // console.log(files)
            const user = await this.getUserId(user_id);
            if (user) {
                if (files.foto_profile !== undefined && files.foto_profile.length !== 0) {
                    for (let index = 0; index < files.foto_profile.length; index++) {
                        resFile = await this.uploadPath(files.foto_profile[index], user_id);
                    }
                    if (data.path_location) {
                        unlinkSync(`dist/src/file/profile/${data.path_location}${data.foto_profile}`)
                    }

                }
                // console.log(resFile)
                // console.log(data)
                if (data.old_password !== '' && data.old_password !== null && data.new_password !== '' && data.new_password !== null) {
                    if (
                        await this.passwordHasher.compareHash(
                            data.old_password,
                            user.login_pass,
                            user.s_pass,
                        )
                    ) {
                        const hasPassword = this.passwordHasher.hasPassword(data.new_password);
                        // let fileData = []
                        dataReady = {
                            user_id: data.user_id,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            address: data.address,
                            phone: data.phone,
                            foto_profile: (resFile) ? resFile.filename : data.foto_profile,
                            path_location: (resFile) ? resFile.path : data.path_location,
                            status_id: 1,
                            user_login: {
                                login_id: user.login_id,
                                status_id: 1,
                                login_code: data.email,
                                login_pass: (await hasPassword).LOGIN_PASS,
                                s_pass: (await hasPassword).SPASS
                            }
                        }
                    } else {
                        return res
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ message: 'Old password did not match' });
                    }
                } else {
                    // console.log(data)
                    dataReady = {
                        user_id: data.user_id,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        address: data.address,
                        phone: data.phone,
                        foto_profile: (resFile) ? resFile.filename : data.foto_profile,
                        path_location: (resFile) ? resFile.path : data.path_location,
                        status_id: 1,
                        user_login: {
                            login_id: user.login_id,
                            status_id: 1,
                            login_code: data.email
                        }
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
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'Save Successfully.', respon: main });
            } else {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'No data found.' });
            }
        } catch (error) {
            console.log(error.message)
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
        return result
    }

    async uploadPath(file, user_id) {

        const exacpath: string = 'dist/src/file/profile/';
        let finalpath: string;
        let finalName;

        let dir = moment(new Date()).format('YYYY') + '/profile-' + user_id + '/';

        if (!existsSync(exacpath + dir)) {
            await mkDir(exacpath + dir);
        }

        let filext = file.originalname.split('.');

        let oldPath = file.path;
        let filename = md5(file.originalname).substr(0, 10);
        let random = Math.floor(Math.random() * 99);

        finalName = moment(new Date()).format('YYYYMMDDHHmm') + random + '-' + filename + '.' + filext[filext.length - 1];
        // finalName = moment(new Date()).format('YYYYMMDDHHmm') + random + '-' + file.originalname;
        finalpath = exacpath + dir + finalName;
        console.log(oldPath, finalpath)
        try {
            await move(oldPath, finalpath)
        } catch (error) {
            console.log('error file')
            console.log(error)
            throw new Error(error);
        }

        return { filename: finalName, path: dir };

    }
}
