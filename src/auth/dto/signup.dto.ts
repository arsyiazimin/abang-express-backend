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

export class updateUserDTO {
    @ApiModelProperty()
    readonly user_id: string;

    @ApiModelProperty()
    readonly first_name: string;

    @ApiModelProperty()
    readonly last_name: string;

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly old_password: string;

    @ApiModelProperty()
    readonly new_password: string;

    @ApiModelProperty()
    readonly phone: string;

    @ApiModelProperty()
    readonly address: string;
    
    @ApiModelProperty()
    readonly foto_profile: string;
    
    @ApiModelProperty()
    readonly path_location: string;

    @ApiModelProperty()
    readonly banner: string;


}