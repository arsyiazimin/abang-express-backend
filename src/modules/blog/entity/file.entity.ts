import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Content } from "./content.entity";

@Entity('t_file')
export class File {
    @PrimaryGeneratedColumn()
    file_id: number;

    @Column()
    content_id: number;

    @Column()
    file_name: string;

    @Column()
    mime_type: string;

    @Column()
    path_location: string;

    @Column()
    device_name: string;

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

    @ManyToOne(type => Content, cont => cont.FILE, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'content_id'})
    CONTENT: Content

}