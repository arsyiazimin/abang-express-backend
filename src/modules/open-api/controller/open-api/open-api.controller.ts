import { Controller, Get, Param, Res, Body, Post } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { BlogService } from 'modules/blog/service/blog/blog.service';
import { get } from 'config';
import { AbangExpressService } from 'global/abang-express/abang-express.service';
import { async } from 'rxjs/internal/scheduler/async';

@ApiUseTags('Open API')
@Controller('open-api')
export class OpenApiController {

    constructor(
        private blogService: BlogService,
        private axService: AbangExpressService
    ) { }

    @Get('files/:year/:folder/:image')
    @ApiImplicitParam({ name: 'year' })
    @ApiImplicitParam({ name: 'folder' })
    @ApiImplicitParam({ name: 'image' })
    async getImage(@Param('year') year, @Param('folder') folder, @Param('image') image, @Res() res): Promise<any> {
        let path = 'src/file/content/';
        res.sendFile(image, { root: path + year + '/' + folder });
    }

    @Get('typeList')
    async getTypeList(@Res() res) {
        return await this.blogService.getTypeList(res);
    }

    @Get('categoryList')
    async getCategoryList(@Res() res) {
        return await this.blogService.getCategoryList(res);
    }

    @Get('slideContent')
    async getSlideContent(@Res() res) {
        return await this.blogService.getSlideContent(res)
    }

    @Get('blogList')
    async getBlogList(@Res() res) {
        return await this.blogService.getBlogList(res)
    }

    @Get('getOneBlog/:content_id')
    @ApiImplicitParam({ name: 'content_id' })
    async getOneBlog(@Param('content_id') content_id, @Res() res) {
        return await this.blogService.getOneBlog(content_id, res)
    }

    @Get('getOneBlogByTitle/:title_url')
    @ApiImplicitParam({ name: 'title_url' })
    async getOneBlogByTitle(@Param('title_url') title_url, @Res() res) {
        return await this.blogService.getOneBlogByTitle(title_url, res)
    }

    @Post('filter')
    async filter(@Body() filterVal, @Res() res) {
        return await this.blogService.filter(filterVal, res)
    }

    @Get('getListAsal')
    async getListAsal(@Res() res) {
        return await this.axService.getAllList(res)
    }

    @Get('getAllTujuan')
    async getAllTujuan(@Res() res) {
        return await this.axService.getAllTujuan(res)
    }

    @Get('priceList/:tujuan/:berat/:asal')
    @ApiImplicitParam({ name: 'tujuan' })
    @ApiImplicitParam({ name: 'berat' })
    @ApiImplicitParam({ name: 'asal' })
    async getPriceList(
        @Param('tujuan') tujuan,
        @Param('berat') berat,
        @Param('asal') asal,
        @Res() res
    ) {
        return await this.axService.getPriceList(tujuan, berat, asal, res)
    }

    @Get('getKotaAgenList')
    async getKotaAgenList(@Res() res) {
        return await this.axService.getKotaAgenList(res)
    }

    @Get('getAllAgent/:kodeagen')
    @ApiImplicitParam({ name: 'kodeagen' })
    async getAllAgent(@Param('kodeagen') kodeagen, @Res() res) {
        return await this.axService.getAllAgent(kodeagen, res)
    }

    @Get('trackResi/:no_resi')
    @ApiImplicitParam({ name: 'no_resi' })
    async trackResi(@Param('no_resi') no_resi, @Res() res) {
        return await this.axService.trackResi(no_resi, res)
    }
}
