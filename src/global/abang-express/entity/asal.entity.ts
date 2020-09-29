import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_asal', { database: 'abaj2285_AX' })
export class asal {
    @PrimaryGeneratedColumn()
    asal_id: number;

    @Column()
    asal_name: string;

    @Column()
    status_id: number;
}