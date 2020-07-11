import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Content } from "./content.entity";

@Entity('t_category_rel')
export class cateRel {
    @PrimaryGeneratedColumn()
    category_rel_id: number;

    @Column()
    category_id: number;

    @Column()
    content_id: number;

    @Column()
    create_id: number;

    @Column()
    create_date: Date;

    @Column()
    update_id: number;

    @Column()
    update_date: Date;

    @ManyToOne(type => Content, cont => cont.CATEGORY_REL, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'content_id' })
    CONTENT: Content
}