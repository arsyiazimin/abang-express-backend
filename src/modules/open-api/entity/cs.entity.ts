import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_customer_service')
export class Cs {
    @PrimaryGeneratedColumn()
    cs_id: number;

    @Column()
    cs_name: string;

    @Column()
    cs_phone: string;

    @Column()
    status: number;
}