import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('pricelistnew', { database: 'abaj2285_AX' })
export class priceList {
    @PrimaryGeneratedColumn()
    code: string;

    @Column()
    vendor: string

    @Column()
    ket: string;

    @Column()
    tujuan: string;

    @Column()
    jenis: string;

    @Column()
    berat: number;

    @Column()
    harga: number;
    
    @Column()
    modal:number;

    @Column()
    inputdate:Date;

    @Column()
    op: string;
}