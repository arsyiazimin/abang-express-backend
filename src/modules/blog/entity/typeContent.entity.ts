import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_type_content')
export class TypeCont {
    @PrimaryGeneratedColumn()
    type_id: number;

    @Column()
    type_name: string;

    @Column()
    status_id: number;

    @Column()
    create_id: number;

    @Column()
    create_date: Date;

    @Column()
    update_id: number;

    @Column()
    update_date: Date;
}