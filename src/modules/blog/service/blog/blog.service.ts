import { Injectable, Res, HttpStatus, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'modules/blog/entity/content.entity';
import { Repository, getManager, Not, IsNull } from 'typeorm';
import { File } from 'modules/blog/entity/file.entity';
import { cateCont } from 'modules/blog/entity/categoryContent.entity';
import { TypeCont } from 'modules/blog/entity/typeContent.entity';
import { cateRel } from 'modules/blog/entity/cateRel.entity';
import * as moment from 'moment';
import * as mkDir from "make-dir";
import * as move from "move-file";
import { unlinkSync, existsSync, mkdirSync, renameSync, mkdir, readFileSync, writeFileSync, copyFileSync, } from 'fs';
import * as md5 from 'md5';
import { RequestContext } from '../../../../common/subscriber/RequestContext';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Content) private readonly ContentRepo: Repository<Content>,
        @InjectRepository(File) private readonly FileRepo: Repository<File>,
        @InjectRepository(cateCont) private readonly cateContRepo: Repository<cateCont>,
        @InjectRepository(TypeCont) private readonly TypeContRepo: Repository<TypeCont>,
        @InjectRepository(cateRel) private readonly cateRelRepo: Repository<cateRel>,
    ) { }

    async getTypeList(@Res() res): Promise<TypeCont[]> {

        try {
            const model = await this.TypeContRepo.find({ where: { status_id: 1 } });
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

    async getCategoryList(@Res() res): Promise<cateCont[]> {

        try {
            const model = await this.cateContRepo.find({ where: { status_id: 1 } });
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

    async saveImageContent(file: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        // let result: { message: string, respon: any, error_bit: boolean } = { message: '', respon: '', error_bit: true };
        let result: any

        await queryRunner.startTransaction();
        try {

            const main = await this.ContentRepo.create({
                slide_bit: 1,
                status_id: 1,
                create_id: RequestContext.currentUser().login_id,
                create_date: new Date()
            });

            await queryRunner.manager.save(main).catch(async error => {
                throw new Error(error);
            })

            let fileData = []
            if (file.length != 0) {
                for (let index = 0; index < file.length; index++) {
                    let resFile = await this.uploadPath(file[index], main['content_id']);
                    fileData.push({
                        content_id: main['content_id'],
                        file_name: resFile.filename,
                        mime_type: file[index].mimetype,
                        path_location: resFile.path,
                        device_name: 'desktop',
                        status_id: 1,
                        create_id: RequestContext.currentUser().login_id,
                        create_date: new Date()
                    });
                }
            }

            const dataFile = await this.FileRepo.create(fileData);
            await queryRunner.manager.save(dataFile).catch(async error => {
                throw new Error(error);
            })

            await queryRunner.commitTransaction();
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Save Successfully' });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }

    async saveBlog(file: any, body: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            // console.log("body")
            // console.log(body)
            const main = await this.ContentRepo.create(body);
            await queryRunner.manager.save(main).catch(async error => {
                throw new Error(error);
            })

            console.log(main)

            let fileData = []
            if (file.file_desktop.length != 0) {
                for (let index = 0; index < file.file_desktop.length; index++) {
                    let resFile = await this.uploadPath(file.file_desktop[index], main['content_id']);
                    fileData.push({
                        content_id: main['content_id'],
                        file_name: resFile.filename,
                        mime_type: file.file_desktop[index].mimetype,
                        path_location: resFile.path,
                        device_name: 'desktop',
                        status_id: 1,
                        create_id: RequestContext.currentUser().login_id,
                        create_date: new Date()
                    });
                }
            }

            if (file.file_mobile.length != 0) {
                for (let index = 0; index < file.file_mobile.length; index++) {
                    let resFile = await this.uploadPath(file.file_mobile[index], main['content_id']);
                    fileData.push({
                        content_id: main['content_id'],
                        file_name: resFile.filename,
                        mime_type: file.file_mobile[index].mimetype,
                        path_location: resFile.path,
                        device_name: 'mobile',
                        status_id: 1,
                        create_id: RequestContext.currentUser().login_id,
                        create_date: new Date()
                    });
                }
            }

            const dataFile = await this.FileRepo.create(fileData);
            await queryRunner.manager.save(dataFile).catch(async error => {
                throw new Error(error);
            })

            console.log(dataFile)

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

    async deleteContent(data: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        let result: { message: string, respon: any, error_bit: boolean } = { message: '', respon: '', error_bit: true };

        await queryRunner.startTransaction();
        try {
            data.update_id = RequestContext.currentUser().login_id
            data.update_date = new Date();
            data.FILE.forEach((element, index) => {
                data.FILE[index].update_id = RequestContext.currentUser().login_id
                data.FILE[index].update_date = new Date()
            });

            const main = await this.ContentRepo.create(data);

            await queryRunner.manager.save(main).catch(async error => {
                throw new Error(error);
            })
            console.log(main)
            await queryRunner.commitTransaction();
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Delete Successfully' });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }

    async updateContent(content_id: number, file: any, data: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();
        let dataRemove = []
        let result: { message: string, respon: any, error_bit: boolean } = { message: '', respon: '', error_bit: true };

        await queryRunner.startTransaction();
        try {
            const main = await this.ContentRepo.create(data);

            const dataExist = await this.ContentRepo.findOne({ where: { content_id: content_id } });
            const dataFile = await this.FileRepo.find({ where: { content_id: content_id } });
            const dataCategoryRel = await this.cateRelRepo.find({ where: { content_id: content_id } });

            dataExist.FILE = dataFile;
            dataExist.CATEGORY_REL = dataCategoryRel;

            dataExist.FILE.forEach(v => {
                if (data.FILE.map(el => el.file_id).indexOf(v.file_id) === -1) {
                    dataRemove.push(v);
                }
            });

            dataExist.CATEGORY_REL.forEach(v => {
                if (data.CATEGORY_REL.map(el => el.category_rel_id).indexOf(v.category_rel_id) === -1) {
                    dataRemove.push(v)
                }
            });

            if (dataRemove.length !== 0) {
                await queryRunner.manager.remove(dataRemove).catch(async err => {
                    throw new Error(err)
                })
            }

            await queryRunner.manager.save(main).catch(async error => {
                throw new Error(error);
            });

            await queryRunner.commitTransaction();
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Delete Successfully' });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }

    async uploadPath(file, content_id) {

        const exacpath: string = 'src/file/content/';
        let finalpath: string;
        let finalName;

        let dir = moment(new Date()).format('YYYY') + '/content-' + content_id + '/';

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

    async getImageContentList(@Res() res): Promise<any> {
        let result: { message: string, respon: any, error_bit: boolean } = { message: '', respon: '', error_bit: true };
        try {
            const dataContent = await this.ContentRepo.find({ where: { status_id: 1, type_id: IsNull() } });

            if (dataContent.length !== 0) {
                const dataFile = await this.FileRepo.find({ where: { status_id: 1 } });

                dataContent.map(async v => v.FILE = await dataFile.filter(e => e.content_id == v.content_id));
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: dataContent });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: dataContent });
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

    async getBlogList(@Res() res): Promise<any> {
        let result: { message: string, respon: any, error_bit: boolean } = { message: '', respon: '', error_bit: true };
        try {
            const dataContent = await this.ContentRepo.find({ where: { status_id: 1, type_id: Not(IsNull()) } });

            if (dataContent.length !== 0) {
                const dataFile = await this.FileRepo.find({ where: { status_id: 1 } });

                dataContent.map(async v => v.FILE = await dataFile.filter(e => e.content_id == v.content_id));
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: dataContent });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: dataContent });
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }
}
