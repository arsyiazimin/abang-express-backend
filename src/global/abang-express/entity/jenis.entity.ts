import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('jenis', { database: 'abaj2285_AX' })
export class jenis {
    @PrimaryColumn()
    id: number;

    @Column()
    nama: string;

    @Column()
    alt: string;
}