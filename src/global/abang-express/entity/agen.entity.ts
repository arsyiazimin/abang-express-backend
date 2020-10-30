import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('users', { database: 'abaj2285_AX' })
export class users {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @Column()
    kodeagen: string;

    @Column()
    nama: string;

    @Column()
    nama2: string;

    @Column()
    kelas: string;

    @Column()
    logo: string;

    @Column()
    header: string;

    @Column()
    alamat: string;

    @Column()
    referal: string;

    @Column()
    kec:string;

    @Column()
    telepon: string;

    @Column()
    registerdate: Date;

    @Column()
    op: string;

    @Column()
    lt: number;

    @Column()
    token: string;

    @Column()
    text: string;

    @Column()
    rate: string;

    @Column()
    wa: string;

    @Column()
    email: string;

    @Column()
    kelas2: string;
}