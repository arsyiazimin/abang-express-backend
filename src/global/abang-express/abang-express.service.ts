import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, Not } from 'typeorm';
import { priceList } from './entity/priceList.entity';
import { ceil } from 'lodash';
import { tujuan } from './entity/tujuan.entity';
import { asal } from './entity/asal.entity';
import { users } from './entity/agen.entity';
import { kotaAgen } from './entity/kotaAgen.entity';
import { Transaksi } from './entity/transaksi.entity';
import { log } from './entity/log.entity';
import { outBound } from './entity/outbound.entity';
import { jenis } from './entity/jenis.entity';

export interface cekPriceInterface {
    tujuan: string;
    asal: string;
    berat: number;
    panjang: number;
    lebar: number;
    tinggi: number;
}

@Injectable()
export class AbangExpressService {
    constructor(
        @InjectRepository(priceList) private readonly priceList: Repository<priceList>,
        @InjectRepository(tujuan) private readonly tujuanRepo: Repository<tujuan>,
        @InjectRepository(asal) private readonly asalRepo: Repository<asal>,
        @InjectRepository(users) private readonly usersRepo: Repository<users>,
        @InjectRepository(kotaAgen) private readonly kotaAgenRepo: Repository<kotaAgen>,
        @InjectRepository(Transaksi) private readonly TransaksiRepo: Repository<Transaksi>,
        @InjectRepository(log) private readonly logRepo: Repository<log>,
        @InjectRepository(outBound) private readonly outBoudRepo: Repository<outBound>,
        @InjectRepository(jenis) private readonly jenisRepo: Repository<jenis>,
    ) { }

    async getPriceList(body: cekPriceInterface, @Res() res): Promise<priceList[]> {
        // console.log(tujuan)
        try {
            // const agen = await getManager('abaj2285_ax').query(`select header, alamat, telepon, wa, rate from users where referal = '${asal}'`);
            console.log(body)
            console.log(+body.panjang)
            console.log(+body.lebar)
            console.log(+body.tinggi)
            let volume = (+body.panjang * +body.lebar * +body.tinggi)
            let berat2 = volume / 5000;
            let berat_fix = body.berat;

            console.log(volume)
            console.log(berat2)
            console.log(ceil(berat2))
            console.log(ceil(body.berat))
            if (ceil(berat2) > ceil(body.berat)) {
                console.log('sini')
                berat_fix = berat2
            }
            console.log(berat_fix)
            const agen = await this.usersRepo.find({
                select: ['header', 'alamat', 'telepon', 'wa', 'rate'],
                where: {
                    referal: body.asal
                }
            })

            const model = await getManager('abaj2285_ax')
                .createQueryBuilder(priceList, 'p')
                .distinct(true)
                .select(`p.tujuan as tujuan`)
                .addSelect(`p.jenis as jenis`)
                .addSelect(`p.berat as berat`)
                .addSelect(`p.harga as harga`)
                .where(`p.tujuan = '${body.tujuan}' AND berat = ${ceil(berat_fix)} AND ket = '${agen[0].rate}'`)
                .getRawMany()
            if (model.length !== 0) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: { priceList: model, agen: agen } })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: { priceList: model, agen: agen } })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error })

        }
    }

    async getAllTujuan(@Res() res): Promise<tujuan[]> {
        try {
            const model = await this.tujuanRepo.find({ where: { status_id: 1 } });
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async getJenis(@Res() res): Promise<jenis[]> {
        try {
            const model = await this.jenisRepo.find();
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async getAllOrder(kodeagen, @Res() res): Promise<jenis[]> {
        try {
            const model = await this.TransaksiRepo.find({ where: { kodeagen: kodeagen } });
            if (model) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'data found.', respon: model })
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: model })
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async getAllList(@Res() res): Promise<asal[]> {
        try {
            const model = await this.asalRepo.find({ where: { status_id: 1 } });
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

    async getKotaAgenList(@Res() res): Promise<kotaAgen[]> {
        try {
            const model = await this.kotaAgenRepo.find({ select: ['kode', 'nama_kota'], where: { status_id: 1 } });
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

    async getAllAgent(kodeAgen: string, @Res() res): Promise<users[]> {
        try {
            const model = await this.usersRepo.find({ select: ['header', 'alamat', 'telepon', 'wa'], where: { kodeagen: kodeAgen, kelas: Not('ud') } });
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

    async trackResi(resi: string, @Res() res): Promise<Transaksi> {

        try {

            var axios = require('axios');
            var data = JSON.stringify({ "awb": resi });
            var config = {
                method: 'post',
                url: 'https://abangexpress.id/api/tracking.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    // console.log(response.data);
                    if (response.data.status === 'success') {
                        return res
                            .status(HttpStatus.OK)
                            .json({ message: 'data found.', respon: response.data });
                    } else {
                        return res
                            .status(HttpStatus.OK)
                            .json({ message: 'no data found.', respon: response.data });
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    throw new Error(error);
                });
            /*
            const trx = await getManager()
                .createQueryBuilder(Transaksi, 'trx')
                .where(`trx.noresi = ${resi}`)
                .orWhere(`trx.resivendor = ${resi}`)
                .getOne();
            if (trx) {
                const logs = await getManager()
                    .createQueryBuilder(log, 'l')
                    .where(`l.resiku = '${trx.noresi}'`)
                    .andWhere(`(l.do = 'input' OR l.do = 'arrival' OR l.do = 'pending')`)
                    .orderBy(`l.nomor`, 'DESC')
                    .getMany();

                if (trx.resivendor === null || trx.vendor === 'ARROW') {

                } else {
                    switch (trx.vendor.toLowerCase()) {
                        case 'aramex':
                            var configAramex = {
                                method: 'get',
                                url: `https://track.aftership.com/aramex/${trx.resivendor}`,
                            };

                            axios(configAramex)
                                .then(function (response) {
                                    console.log(JSON.stringify(response.data));
                                    return res
                                        .status(HttpStatus.OK)
                                        .json({ message: 'data found.', respon: response.data });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    throw new Error(error);
                                });
                            break;

                        case 'sf':
                            let vendor = 'sf-express'
                            var configSf = {
                                method: 'get',
                                url: `https://track.aftership.com/${vendor}/${trx.resivendor}`,
                            };

                            axios(configSf)
                                .then(function (response) {
                                    console.log(JSON.stringify(response.data));
                                    return res
                                        .status(HttpStatus.OK)
                                        .json({ message: 'data found.', respon: response.data });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    throw new Error(error);
                                });
                            break;

                        case 'gps':


                            if (trx.tujuan.toLowerCase() === 'taiwan') {
                                var data = qs.stringify({
                                    'no': trx.resivendor
                                });
                                var configGpsTaiwan = {
                                    method: 'post',
                                    url: 'http://www.menq.com.tw/e-track/api/get-search.asp',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Cookie': 'ASPSESSIONIDAAQSBAQC=DBPNPNOBPKJNCOJPPFPHEIOI; ASPSESSIONIDAAQQCDQD=ALONDKABMFNHELKHDCFELPAB'
                                    },
                                    data: data
                                };

                                axios(configGpsTaiwan)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        return res
                                            .status(HttpStatus.OK)
                                            .json({ message: 'data found.', respon: response.data.result });
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                        throw new Error(error);
                                    });
                            } else {

                                var configGps = {
                                    method: 'get',
                                    url: `https://system.tgiexpress.com/api/v1/process_track_api?api_key=kDXTe4eJ4lQkDMZtSficnxxJiPjDAVNe&referenceNumber=${trx.resivendor}&processMasterCode=shipment_tracking`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAwZDVlMWMzMzRlNTU4NGNjMTY4ODdlYjBmNTMxMzgyNDBkNGE5OTFmNzA2Y2MxYmUzODcxNDdmOTdkYWU5MWUzZWM3Mzc3ZGUwYzFiYmM3In0.eyJhdWQiOiI1IiwianRpIjoiMDBkNWUxYzMzNGU1NTg0Y2MxNjg4N2ViMGY1MzEzODI0MGQ0YTk5MWY3MDZjYzFiZTM4NzE0N2Y5N2RhZTkxZTNlYzczNzdkZTBjMWJiYzciLCJpYXQiOjE1NjQxMjAxOTAsIm5iZiI6MTU2NDEyMDE5MCwiZXhwIjoxNTk1NzQyNTkwLCJzdWIiOiIxODUiLCJzY29wZXMiOltdfQ.FBlcvjVH2pKO5xEl38e99TnnXzlrLqs81GEVfXQFSSxACnr-ejK6p5Y_a1bqT3kK7figwzJFIH79Pc18gBMDID8LuRhWCa7YtE-W3_FpHC5GRtvVhBU8Z1juVkiyrGHVpn-gqg3K9ODD5lOKOwX2HtUvxiXdj2Qwhj1DNAAMOUL_OIHxgojrNOAR-s5143ZgjqiECzryCvJmdMuh8GY4BQTjF7mai3_QxUt1ceAtxP9mrNMC2cfLXRH5jlhbYZLFpOT3sxIl4gnPVm0La5z56SemWjOCrCTXaAYvyiY33Ypq-v4Hy_WVRnV5pmQK_7u8-vPnqWhqE0_5lzubJGCAjwAC5rCPeIrdNxEcwMpKzgAHuBN4dj-veGZgBGo6rGFYH7gYaoctAgcNruzMY-V3p24nHvRHAgFw5xlZMbT170lBGit-XmEzl-jePmRPwWpgw95uvvnyFLHc3BEsNT6k3CIBbYvrNGN3JO6uzGEofTYzeMVHBiQ34xbcMEOa1wmEaXMitIR7NeqXGfJtUHepOFACYb7sT4c1K4KUCEoTEZ4osDK11egxAltYLyNjcvAzONZbs32MZiu_Z-VUq-dba0H6pasQqoMYjWVBj3CEkKJyCrqb6dwnJe09AmUOGpXgqBozntc1aO0eOOCT3ju9A8xDisCPvFeJsrvJeTHqH6g',
                                        'x-api-key': 'k1EhyazbSwWQNiad5zh4ebWqBIQZbPN7'
                                    }
                                };

                                axios(configGps)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        if (response.data === 'No Tracking Status Found..') {
                                            var configGps1 = {
                                                method: 'get',
                                                url: `https://apiexpos.mile.app/public/v1/connote-activity?connote_code=${trx.resivendor}`,
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAwZDVlMWMzMzRlNTU4NGNjMTY4ODdlYjBmNTMxMzgyNDBkNGE5OTFmNzA2Y2MxYmUzODcxNDdmOTdkYWU5MWUzZWM3Mzc3ZGUwYzFiYmM3In0.eyJhdWQiOiI1IiwianRpIjoiMDBkNWUxYzMzNGU1NTg0Y2MxNjg4N2ViMGY1MzEzODI0MGQ0YTk5MWY3MDZjYzFiZTM4NzE0N2Y5N2RhZTkxZTNlYzczNzdkZTBjMWJiYzciLCJpYXQiOjE1NjQxMjAxOTAsIm5iZiI6MTU2NDEyMDE5MCwiZXhwIjoxNTk1NzQyNTkwLCJzdWIiOiIxODUiLCJzY29wZXMiOltdfQ.FBlcvjVH2pKO5xEl38e99TnnXzlrLqs81GEVfXQFSSxACnr-ejK6p5Y_a1bqT3kK7figwzJFIH79Pc18gBMDID8LuRhWCa7YtE-W3_FpHC5GRtvVhBU8Z1juVkiyrGHVpn-gqg3K9ODD5lOKOwX2HtUvxiXdj2Qwhj1DNAAMOUL_OIHxgojrNOAR-s5143ZgjqiECzryCvJmdMuh8GY4BQTjF7mai3_QxUt1ceAtxP9mrNMC2cfLXRH5jlhbYZLFpOT3sxIl4gnPVm0La5z56SemWjOCrCTXaAYvyiY33Ypq-v4Hy_WVRnV5pmQK_7u8-vPnqWhqE0_5lzubJGCAjwAC5rCPeIrdNxEcwMpKzgAHuBN4dj-veGZgBGo6rGFYH7gYaoctAgcNruzMY-V3p24nHvRHAgFw5xlZMbT170lBGit-XmEzl-jePmRPwWpgw95uvvnyFLHc3BEsNT6k3CIBbYvrNGN3JO6uzGEofTYzeMVHBiQ34xbcMEOa1wmEaXMitIR7NeqXGfJtUHepOFACYb7sT4c1K4KUCEoTEZ4osDK11egxAltYLyNjcvAzONZbs32MZiu_Z-VUq-dba0H6pasQqoMYjWVBj3CEkKJyCrqb6dwnJe09AmUOGpXgqBozntc1aO0eOOCT3ju9A8xDisCPvFeJsrvJeTHqH6g',
                                                    'x-api-key': 'k1EhyazbSwWQNiad5zh4ebWqBIQZbPN7'
                                                }
                                            };

                                            axios(configGps1)
                                                .then(function (response) {
                                                    console.log(JSON.stringify(response.data));
                                                    return res
                                                        .status(HttpStatus.OK)
                                                        .json({ message: 'data found.', respon: response.data.data });
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                    throw new Error(error);
                                                });
                                        } else {
                                            return res
                                                .status(HttpStatus.OK)
                                                .json({ message: 'data found.', respon: response.data });
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                        throw new Error(error);
                                    });
                            }
                            break;

                        case 'tec':
                            if (trx.tujuan === 'taiwan') {

                            }
                            break;
                    }
                }
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'no data found.', respon: trx });
            }*/
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message, respon: error });
        }
    }

    async getUserByUsername(username: string): Promise<users> {
        username = username.toLowerCase()
        const user = await getManager()
            .createQueryBuilder(users, 'user')
            .where(`LOWER(user.username) = :username`, { username: username })
            .getOne()
        return user;
    }

    async outboudProses(body: any, @Res() res): Promise<any> {
        const entityManager = getManager();
        const connection = entityManager.connection;
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const trx = await getManager('abaj2285_ax')
                .createQueryBuilder(Transaksi, 'trx')
                .where(`trx.noresi = ${body.no_resi}`)
                .orWhere(`trx.resivendor = ${body.no_resi}`)
                .getOne();

            if (trx) {
                const dataOut = await this.outBoudRepo.findOne({ where: { resi: body.no_resi } });
                if (dataOut) {
                    /**
                     * input ke outbound
                     * bisa input selama pcs di outboud kurang dari pcs di trx
                     */
                    if (dataOut.pcs < trx.pcs) {
                        dataOut.pcs = dataOut.pcs + 1
                        dataOut.counter = dataOut.counter + 1

                        await queryRunner.manager.save(dataOut).catch(async error => {
                            throw new Error(error);
                        })
                    } else {
                        /**
                         * bingung kata2nya mau apa wkwkwk
                         */
                        return res
                            .status(HttpStatus.OK)
                            .json({ message: 'Nilai pcs transaksi = pcs outbound', respon: trx });
                    }
                } else {
                    let out = {
                        id: null,
                        resi: body.no_resi,
                        tanggal: new Date(),
                        pcs: 1,
                        counter: 1
                    }
                    const newOut = await this.outBoudRepo.create(out)
                    await queryRunner.manager.save(newOut).catch(async error => {
                        throw new Error(error);
                    })
                }
                // await queryRunner.rollbackTransaction();
                await queryRunner.commitTransaction();
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'Save Successfully' });
            } else {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'Resi tidak ditemukan', respon: trx });
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        } finally {
            await queryRunner.release();
        }
    }
}
