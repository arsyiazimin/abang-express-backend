import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_kota_agen', { database: 'abaj2285_ax' })
export class kotaAgen {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    kode: string;

    @Column()
    nama_kota: string;

    @Column()
    status_id: number;
}