import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company.entity';
import { Repository, getManager } from 'typeorm';
import { RequestContext } from '../../../common/subscriber/RequestContext';
import * as moment from 'moment';
import * as mkDir from "make-dir";
import * as move from "move-file";
import { unlinkSync, existsSync, mkdirSync, renameSync, mkdir, readFileSync, writeFileSync, copyFileSync, } from 'fs';
import * as md5 from 'md5';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company) private readonly companyRepo: Repository<Company>
    ) { }

    async getOneCompany(company_id: number, @Res() res): Promise<Company> {
        try {
            const model = await this.companyRepo.findOne({ where: { status_id: 1, company_id: company_id } });
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model });
            }

        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async uploadPath(file, company_id) {

        const exacpath: string = 'dist/src/file/company/';
        let finalpath: string;
        let finalName;

        let dir = moment(new Date()).format('YYYY') + '/company-' + company_id + '/';

        if (!existsSync(exacpath + dir)) {
            await mkDir(exacpath + dir);
        }

        let filext = file.originalname.split('.');

        let oldPath = file.path;
        let filename = md5(file.originalname).substr(0, 10);
        let random = Math.floor(Math.random() * 99);

        finalName = moment(new Date()).format('YYYYMMDDHHmm') + random + '-' + filename + '.' + filext[filext.length - 1];
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

    async saveCompany(file: any, body, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataCompany = await this.companyRepo.create(body);
            await queryRunner.manager.save(dataCompany).catch(async error => {
                throw new Error(error);
            })

            let fileData = []
            if (file.menu_logo !== undefined && file.menu_logo.length != 0) {
                for (let index = 0; index < file.menu_logo.length; index++) {
                    let resFile = await this.uploadPath(file.menu_logo[index], dataCompany['company_id']);
                    fileData.push({
                        company_id: dataCompany['company_id'],
                        menu_logo: resFile.filename,
                        path_location: resFile.path
                    });
                }
            }

            if (file.menu_logo_scrolled !== undefined && file.menu_logo_scrolled.length != 0) {
                for (let index = 0; index < file.menu_logo_scrolled.length; index++) {
                    let resFile = await this.uploadPath(file.menu_logo_scrolled[index], dataCompany['company_id']);
                    fileData.push({
                        company_id: dataCompany['company_id'],
                        menu_logo_scrolled: resFile.filename,
                        path_location: resFile.path
                    });
                }
            }

            if (file.title_logo !== undefined && file.title_logo.length != 0) {
                for (let index = 0; index < file.title_logo.length; index++) {
                    let resFile = await this.uploadPath(file.title_logo[index], dataCompany['company_id']);
                    fileData.push({
                        company_id: dataCompany['company_id'],
                        title_logo: resFile.filename,
                        path_location: resFile.path
                    });
                }

            }

            const updateCompany = await this.companyRepo.create(fileData);
            await queryRunner.manager.save(updateCompany).catch(async error => {
                throw new Error(error);
            })

            await queryRunner.commitTransaction();
            // await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Save Successfully' });
        } catch (error) {
            console.log(error)
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }

    async updateCompany(company_id: number, file: any, body, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataExist = await this.companyRepo.findOne(company_id)
            if (dataExist) {
                const dataCompany = await this.companyRepo.create(body);
                await queryRunner.manager.save(dataCompany).catch(async error => {
                    throw new Error(error);
                })

                let fileData = []
                if (file.menu_logo !== undefined && file.menu_logo.length != 0) {
                    for (let index = 0; index < file.length; index++) {
                        let resFile = await this.uploadPath(file.menu_logo[index], dataCompany['company_id']);
                        fileData.push({
                            company_id: dataCompany['company_id'],
                            menu_logo: resFile.filename,
                            path_location: resFile.path
                        });
                    }
                }

                if (file.menu_logo_scrolled !== undefined && file.menu_logo_scrolled.length != 0) {
                    for (let index = 0; index < file.length; index++) {
                        let resFile = await this.uploadPath(file.menu_logo_scrolled[index], dataCompany['company_id']);
                        fileData.push({
                            company_id: dataCompany['company_id'],
                            menu_logo_scrolled: resFile.filename,
                            path_location: resFile.path
                        });
                    }
                }

                if (file.title_logo !== undefined && file.title_logo.length != 0) {
                    for (let index = 0; index < file.length; index++) {
                        let resFile = await this.uploadPath(file.title_logo[index], dataCompany['company_id']);
                        fileData.push({
                            company_id: dataCompany['company_id'],
                            title_logo: resFile.filename,
                            path_location: resFile.path
                        });
                    }

                }

                const updateCompany = await this.companyRepo.create(fileData);
                await queryRunner.manager.save(updateCompany).catch(async error => {
                    throw new Error(error);
                })

                await queryRunner.commitTransaction();
                // await queryRunner.rollbackTransaction();
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'Save Successfully' });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'No data found.' });
            }
        } catch (error) {
            console.log(error)
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }
}
