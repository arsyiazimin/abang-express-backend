import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_category_content')
export class cateCont {
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column()
    category_name: string;

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