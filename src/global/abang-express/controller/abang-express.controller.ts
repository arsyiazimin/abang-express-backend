import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { AbangExpressService } from '../abang-express.service';

@ApiUseTags('Abang Express')
@Controller('abang-express')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AbangExpressController {
    constructor(
        private abangExpressService: AbangExpressService
    ) { }

    @Post('outBoundProses')
    async getImageContentList(@Body() body, @Res() res) {
        return await this.abangExpressService.outboudProses(body, res)
    }
}
