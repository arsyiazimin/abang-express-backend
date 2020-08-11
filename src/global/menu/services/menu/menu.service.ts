import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from "../../entity/menu.entity";
import { Repository, getManager } from 'typeorm';
import { RequestContext } from '../../../../common/subscriber/RequestContext';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    ) { }

    async getAllMenu(): Promise<Menu[]> {
        return await this.menuRepo.find({ where: { IS_ACTIVE: 1 } });
    }

    async addBookmark(menu_id: number, data: any): Promise<Menu[]> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();
        let result: any
        await queryRunner.startTransaction();
        try {
            const menu = await this.menuRepo.create(data);
            await queryRunner.manager.save(menu).catch(async err => {
                throw new Error(err);
            });
            await queryRunner.commitTransaction();
            const dataMenu = await this.getAllMenu();
            result = { result: dataMenu, error_bit: false }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            result = { result: error.message, error_bit: true }
        } finally {
            await queryRunner.release();
        }
        return result;
    }
}
