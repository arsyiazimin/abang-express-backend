import { Controller, UseGuards, Get, Post, UseInterceptors, UploadedFiles, Body, Put, Param, Res } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from 'modules/blog/service/blog/blog.service';
import { FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiUseTags('Blog')
@Controller('blog')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BlogController {
    constructor(
        private blogService: BlogService
    ) { }

    @Get('typeList')
    async getTypeList(@Res() res) {
        return await this.blogService.getTypeList(res);
    }

    @Get('categoryList')
    async getCategoryList(@Res() res) {
        return await this.blogService.getCategoryList(res);
    }

    @Get('imageContentList')
    async getImageContentList(@Res() res) {
        return await this.blogService.getImageContentList(res)
    }

    @Get('blogList')
    async getBlogList(@Res() res) {
        return await this.blogService.getBlogList(res)
    }

    @Post('deleteContent')
    async deleteContent(@Body() data, @Res() res) {
        return await this.blogService.deleteContent(data, res);
    }

    @Post('saveImageContent')
    @UseInterceptors(FilesInterceptor('file', 100, {
        storage: diskStorage({
            filename: (req, file, cb) => {
                let name = file.originalname.split('.').slice(0, -1)
                const randomName = `${name}`
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async saveImageContent(@UploadedFiles() file, @Res() res) {
        return await this.blogService.saveImageContent(file, res)
    }

    @Post('saveBlog')
    // @UseInterceptors(FilesInterceptor('file_desktop', 100, {
    //     storage: diskStorage({
    //         filename: (req, file_desktop, cb) => {
    //             let name = file_desktop.originalname.split('.').slice(0, -1)
    //             const randomName = `${name}`
    //             return cb(null, `${randomName}${extname(file_desktop.originalname)}`)
    //         }
    //     })
    // }))
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'file_desktop',
        },
        {
            name: 'file_mobile'
        }
    ]))
    async saveBlog(@UploadedFiles() files, @Body() Body, @Res() res) {
        let data = JSON.parse(Body.data)
        // console.log(files)
        return await this.blogService.saveBlog(files, data, res)
    }
}