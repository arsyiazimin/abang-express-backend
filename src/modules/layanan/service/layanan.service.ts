import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Layanan } from '../entity/layanan.entity';
import { Repository, getManager } from 'typeorm';
import { RequestContext } from '../../../common/subscriber/RequestContext';
import * as moment from 'moment';
import * as mkDir from "make-dir";
import * as move from "move-file";
import { unlinkSync, existsSync, mkdirSync, renameSync, mkdir, readFileSync, writeFileSync, copyFileSync, } from 'fs';
import * as md5 from 'md5';
import * as config from 'config';

@Injectable()
export class LayananService {

    folderRoot = config.get('FOLDER_ROOT')

    constructor(
        @InjectRepository(Layanan) private readonly layananRepo: Repository<Layanan>
    ) { }

    async getAllLayanan(@Res() res): Promise<Layanan[]> {
        try {
            const model = await this.layananRepo.find({ where: { status_id: 1 }, order: { layanan_id: 'ASC' } });
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

    async getOneLayanan(layanan_id: number, @Res() res): Promise<Layanan> {
        try {
            const model = await this.layananRepo.findOne({ where: { status_id: 1, layanan_id: layanan_id } });
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

    async uploadPath(file, layanan_id) {

        const exacpath: string = `${this.folderRoot}file/layanan/`;
        let finalpath: string;
        let finalName;

        let dir = moment(new Date()).format('YYYY') + '/layanan-' + layanan_id + '/';

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

    async saveLayanan(file: any, body, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataLayanan = await this.layananRepo.create(body);
            await queryRunner.manager.save(dataLayanan).catch(async error => {
                throw new Error(error);
            })

            let fileData = []
            if (file !== undefined && file.length != 0) {
                for (let index = 0; index < file.length; index++) {
                    let resFile = await this.uploadPath(file[index], dataLayanan['layanan_id']);
                    fileData.push({
                        layanan_id: dataLayanan['layanan_id'],
                        icon_name: resFile.filename,
                        path_location: resFile.path
                    });
                }
                const updateLayanan = await this.layananRepo.create(fileData);
                await queryRunner.manager.save(updateLayanan).catch(async error => {
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

    async updateLayanan(layanan_id: number, file: any, body, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const dataExist = await this.layananRepo.findOne(layanan_id)
            if (dataExist) {
                const dataLayanan = await this.layananRepo.create(body);
                await queryRunner.manager.save(dataLayanan).catch(async error => {
                    throw new Error(error);
                })

                let fileData = []
                if (file !== undefined && file.length != 0) {
                    for (let index = 0; index < file.length; index++) {
                        let resFile = await this.uploadPath(file[index], dataLayanan['layanan_id']);
                        fileData.push({
                            layanan_id: dataLayanan['layanan_id'],
                            icon_name: resFile.filename,
                            path_location: resFile.path
                        });
                    }
                    const updateLayanan = await this.layananRepo.create(fileData);
                    await queryRunner.manager.save(updateLayanan).catch(async error => {
                        throw new Error(error);
                    })
                }

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
