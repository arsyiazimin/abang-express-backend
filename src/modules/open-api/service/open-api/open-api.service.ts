import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Cs } from '../../entity/cs.entity';

@Injectable()
export class OpenApiService {
    constructor(
        @InjectRepository(Cs) private readonly csRepo: Repository<Cs>
    ) { }

    async getAllCs(@Res() res): Promise<Cs[]> {
        try {
            const model = await this.csRepo.find({ where: { status: 1 }, order: { cs_id: 'ASC' } });
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model });
            }

        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }
}
