import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";

@Entity('transaksi', { database: 'abaj2285_AX' })
export class Transaksi {
    @PrimaryColumn()
    noresi: string;

    @Column()
    kodeagen: string;

    @Column()
    pengirim: string;

    @Column()
    telepon: string;

    @Column()
    penerima: string;

    @Column()
    teleponp: string;

    @Column()
    alamat: string;

    @Column()
    kodepos: string;

    @Column()
    ktp: string;

    @Column()
    linkktp: string;

    @Column()
    tujuan: string;

    @Column()
    charges: string;

    @Column()
    jenis: string;

    @Column()
    desc: string;

    @Column()
    berat: string;

    @Column()
    beratax: string;

    @Column()
    pcs: number;

    @Column()
    vendor: string;

    @Column()
    resivendor: string;

    @Column()
    pricecode: string;

    @Column()
    tglorder: Date;

    @Column()
    ordertime: Date;

    @Column()
    lastupdate: Date;

    @Column()
    harga: number;

    @Column()
    modal: number;

    @Column()
    statusnotapel: string;

    @Column()
    notagihan: string;

    @Column()
    statusnotavendor: string;

    @Column()
    notavendor: string;

    @Column()
    op: string;

    @Column()
    token: string;

    @Column()
    statustransaksi: string;

    @Column()
    costumvalue: number;

    @Column()
    lt: number;

    @Column()
    tglkirim: Date;

    @Column()
    city: string;

    @Column()
    prov: string;

    @Column()
    rl: string;

    @Column()
    me: string;

    @Column()
    statme: string;
}