import { Controller, UseGuards, Get, Res, Param, Post, UseInterceptors, Body, UploadedFiles, Put } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LayananService } from '../service/layanan.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiUseTags('Layanan')
@Controller('layanan')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LayananController {
    constructor(
        private layananService: LayananService
    ) { }

    @Get('getAllLayanan')
    async getAllLayanan(@Res() res) {
        return await this.layananService.getAllLayanan(res)
    }

    @Get('getOneLayanan/:layanan_id')
    @ApiImplicitParam({ name: 'layanan_id' })
    async getOneLayanan(@Param('layanan_id') layanan_id, @Res() res) {
        return await this.layananService.getOneLayanan(layanan_id, res)
    }

    @Post('saveLayanan')
    @UseInterceptors(FilesInterceptor('file', 100, {
        storage: diskStorage({
            filename: (req, file, cb) => {
                let name = file.originalname.split('.').slice(0, -1)
                const randomName = `${name}`
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async saveLayanan(@UploadedFiles() file, @Body() Body, @Res() res) {
        let data = JSON.parse(Body.data)
        return await this.layananService.saveLayanan(file, data, res)
    }

    @Put('updateLayanan/:layanan_id')
    @ApiImplicitParam({ name: 'layanan_id' })
    @UseInterceptors(FilesInterceptor('file', 100, {
        storage: diskStorage({
            filename: (req, file, cb) => {
                let name = file.originalname.split('.').slice(0, -1)
                const randomName = `${name}`
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async updateLayanan(@Param('layanan_id') layanan_id, @UploadedFiles() file, @Body() Body, @Res() res) {
        let data = JSON.parse(Body.data)
        return await this.layananService.updateLayanan(layanan_id, file, data, res)
    }

    @Put('deleteLayanan/:layanan_id')
    @ApiImplicitParam({ name: 'layanan_id' })
    async deleteLayanan(@Param('layanan_id') layanan_id, @Body() Body, @Res() res) {
        return await this.layananService.updateLayanan(layanan_id, [], Body, res)
    }
}
