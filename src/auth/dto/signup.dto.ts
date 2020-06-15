import { ApiModelProperty } from '@nestjs/swagger';
import { read } from 'fs';

export class SignupDTO {
    @ApiModelProperty()
    readonly first_name: string;

    @ApiModelProperty()
    readonly last_name: string;

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly password: string;
}