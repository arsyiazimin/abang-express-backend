import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { File } from "./file.entity";
import { cateRel } from "./cateRel.entity";


@Entity('t_content')
export class Content {
    @PrimaryGeneratedColumn()
    content_id: number;

    @Column()
    title: string;

    @Column()
    title_url: string;

    @Column()
    content: string;

    @Column()
    type_id: number;

    @Column()
    slide_bit: number;

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

    @Column()
    views: number;

    @OneToMany(type => File, file => file.CONTENT, { cascade: ['insert', 'update'], onDelete: 'CASCADE', eager: true })
    FILE: File[];

    @OneToMany(type => cateRel, cate_rel => cate_rel.CONTENT, { cascade: ['insert', 'update'], onDelete: 'CASCADE', eager: true })
    CATEGORY_REL: cateRel[];
}