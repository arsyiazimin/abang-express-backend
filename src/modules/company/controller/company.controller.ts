import { Controller, UseGuards, Get, Param, Res, Post, UseInterceptors, UploadedFiles, Body, Put } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from '../service/company.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiUseTags('Company')
@Controller('company')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
    constructor(
        private companyService: CompanyService
    ) { }

    @Get('getOneCompany/:company_id')
    @ApiImplicitParam({ name: 'company_id' })
    async getOneCompany(@Param('company_id') company_id, @Res() res) {
        return await this.companyService.getOneCompany(company_id, res)
    }

    @Post('saveCompany')
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'menu_logo',
        },
        {
            name: 'menu_logo_scrolled'
        },
        {
            name: 'title_logo'
        }
    ]))
    async saveCompany(@UploadedFiles() files, @Body() Body, @Res() res) {
        let data = JSON.parse(Body.data)
        return await this.companyService.saveCompany(files, data, res)
    }

    @Put('updateCompany/:company_id')
    @ApiImplicitParam({ name: 'company_id' })
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'menu_logo',
        },
        {
            name: 'menu_logo_scrolled'
        },
        {
            name: 'title_logo'
        }
    ]))
    async updateCompany(@Param('company_id') company_id, @UploadedFiles() files, @Body() Body, @Res() res) {
        let data = JSON.parse(Body.data)
        return await this.companyService.updateCompany(company_id, files, data, res)
    }
}
