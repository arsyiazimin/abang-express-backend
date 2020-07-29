import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_layanan')
export class Layanan {
    @PrimaryGeneratedColumn()
    layanan_id: number;

    @Column()
    layanan_name: string;

    @Column()
    icon_name: string;

    @Column()
    path_location: string;

    @Column()
    layanan_desc: string;

    @Column()
    status_id: number;
}