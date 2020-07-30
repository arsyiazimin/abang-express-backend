import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_partner')
export class Partner {
    @PrimaryGeneratedColumn()
    partner_id: number;

    @Column()
    logo_name: string;

    @Column()
    path_location: string;

    @Column()
    status_id: number;
}