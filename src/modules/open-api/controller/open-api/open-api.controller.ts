import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';

@ApiUseTags('Open API')
@Controller('open-api')
export class OpenApiController {

    @Get('files/:year/:folder/:image')
    @ApiImplicitParam({ name: 'year' })
    @ApiImplicitParam({ name: 'folder' })
    @ApiImplicitParam({ name: 'image' })
    async getImage(@Param('year') year, @Param('folder') folder, @Param('image') image, @Res() res): Promise<any> {
        let path = 'src/file/content/';
        console.log(path + year + '/' + folder)
        res.sendFile(image, { root: path + year + '/' + folder });
    }
}
