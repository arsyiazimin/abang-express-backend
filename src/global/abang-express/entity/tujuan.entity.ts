import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_tujuan', { database: 'abaj2285_ax' })
export class tujuan {
    @PrimaryGeneratedColumn()
    tujuan_id: number;

    @Column()
    tujuan_name: string;

    @Column()
    status_id: number
}