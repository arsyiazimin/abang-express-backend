import { Controller, UseGuards, Get, Res, Param, Post, Body, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PartnerService } from '../service/partner.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiUseTags('Partner')
@Controller('partner')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PartnerController {
    constructor(
        private partnerService: PartnerService
    ) { }

    @Get('getAllPartner')
    async getAllpartner(@Res() res) {
        return await this.partnerService.getAllPartner(res)
    }

    @Get('getOnePartner/:partner_id')
    @ApiImplicitParam({ name: 'partner_id' })
    async getOnepartner(@Param('partner_id') partner_id, @Res() res) {
        return await this.partnerService.getOnePartner(partner_id, res)
    }

    @Post('savePartner')
    @UseInterceptors(FilesInterceptor('file', 100, {
        storage: diskStorage({
            filename: (req, file, cb) => {
                let name = file.originalname.split('.').slice(0, -1)
                const randomName = `${name}`
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async savePartner(@UploadedFiles() file, @Body() Body, @Res() res) {
        return await this.partnerService.savePartner(file, Body, res)
    }

    @Put('updatePartner/:partner_id')
    async updatePartner(@Param('partner_id') partner_id, @Body() Body, @Res() res) {
        return await this.partnerService.updatePartner(partner_id, Body, res)
    }
}
