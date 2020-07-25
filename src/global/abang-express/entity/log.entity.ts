import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('log', { database: 'abaj2285_ax' })
export class log {
    @PrimaryColumn()
    nomor: number;

    @Column()
    do: string;

    @Column()
    code: string;

    @Column()
    log: string;

    @Column()
    resiku: string;

    @Column()
    waktu: Date;
}