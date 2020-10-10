import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entity/partner.entity';
import { Repository, getManager } from 'typeorm';
import * as moment from 'moment';
import * as mkDir from "make-dir";
import * as move from "move-file";
import { unlinkSync, existsSync, mkdirSync, renameSync, mkdir, readFileSync, writeFileSync, copyFileSync, } from 'fs';
import * as md5 from 'md5';
import * as config from 'config';

@Injectable()
export class PartnerService {

    folderRoot = config.get('FOLDER_ROOT')

    constructor(
        @InjectRepository(Partner) private readonly partnerRepo: Repository<Partner>
    ) { }

    async getAllPartner(@Res() res): Promise<Partner[]> {
        try {
            const model = await this.partnerRepo.find({ where: { status_id: 1 }, order: { partner_id: 'ASC' } })
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async getOnePartner(partner_id: number, @Res() res): Promise<Partner> {
        try {
            const model = await this.partnerRepo.find({ where: { status_id: 1, partner_id: partner_id } })
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async uploadPath(file, layanan_id) {

        const exacpath: string = `${this.folderRoot}file/partner/`;
        let finalpath: string;
        let finalName;

        let dir = moment(new Date()).format('YYYY') + '/partner-' + layanan_id + '/';

        if (!existsSync(exacpath + dir)) {
            await mkDir(exacpath + dir);
        }

        let filext = file.originalname.split('.');

        let oldPath = file.path;
        // let filename = md5(file.originalname).substr(0, 10);
        let filename = file.originalname;
        let random = Math.floor(Math.random() * 99);

        finalName = filename + '.' + filext[filext.length - 1];
        finalpath = exacpath + dir + file.originalname;
        console.log(oldPath, finalpath)
        try {
            await move(oldPath, finalpath)
        } catch (error) {
            console.log('error file')
            console.log(error)
            throw new Error(error);
        }

        return { filename: file.originalname, path: dir };

    }

    async savePartner(file: any, body: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataPartner = await this.partnerRepo.create(body);
            await queryRunner.manager.save(dataPartner).catch(async error => {
                throw new Error(error);
            })

            let fileData = []
            if (file !== undefined && file.length != 0) {
                for (let index = 0; index < file.length; index++) {
                    let resFile = await this.uploadPath(file[index], dataPartner['partner_id']);
                    fileData.push({
                        partner_id: dataPartner['partner_id'],
                        logo_name: resFile.filename,
                        path_location: resFile.path,
                        status_id: 1
                    });
                }
                const updatePartner = await this.partnerRepo.create(fileData);
                await queryRunner.manager.save(updatePartner).catch(async error => {
                    throw new Error(error);
                })
            }

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

    async updatePartner(partner_id: number, body: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataExist = await this.partnerRepo.findOne(partner_id);
            if (dataExist) {
                const dataPartner = await this.partnerRepo.create(body);
                await queryRunner.manager.save(dataPartner).catch(async error => {
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
