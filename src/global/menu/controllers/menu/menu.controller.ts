import { Controller, UseGuards, Get, Put, Param, Body } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { MenuService } from '../../../../global/menu/services/menu/menu.service';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('Menu')
@Controller('menu')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MenuController {
    constructor(
        private menuServices: MenuService
    ) { }

    @Get('listmenu')
    async getListMenu() {
        return await this.menuServices.getAllMenu();
    }

    @Put('add/bookmark/:menu_id')
    @ApiImplicitParam({ name: 'menu_id' })
    async addBookmark(@Param('menu_id') menu_id, @Body() body) {
        return await this.menuServices.addBookmark(menu_id, body);
    }

}
