import { Controller, Get, Param, Res, Body, Post } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { BlogService } from 'modules/blog/service/blog/blog.service';

@ApiUseTags('Open API')
@Controller('open-api')
export class OpenApiController {

    constructor(
        private blogService: BlogService
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
}
