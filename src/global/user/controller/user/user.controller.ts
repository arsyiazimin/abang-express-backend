import { Controller, UseGuards, Post, UseInterceptors, UploadedFiles, Res, Put, Param, Body, Get, HttpStatus } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'global/user/services/user/user.service';
import { FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiUseTags('User')
@Controller('user')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Put('update/:user_id')
    @ApiImplicitParam({ name: 'user_id' })
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'foto_profile',
        },
    ]))
    async saveImageContentDesktop(@Param('user_id') user_id, @Body() Body, @UploadedFiles() files, @Res() res) {
        let data = JSON.parse(Body.data)
        return await this.userService.updateUser(user_id, data, files, res)
    }

    @Get('getOneUser/:user_id')
    @ApiImplicitParam({ name: 'user_id' })
    async getOneUser(@Param('user_id') user_id, @Res() res) {
        const user = await this.userService.getUserById(user_id)
        if (user) {
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Data Found.', respon: user });
        }
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'No data found.' });
    }
}
