import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('m_company')
export class Company {
    @PrimaryGeneratedColumn()
    company_id: number;

    @Column()
    company_name: string;

    @Column()
    address_name: string;

    @Column()
    facebook_name: string;

    @Column()
    instagram_name: string;

    @Column()
    hotline: string;

    @Column()
    menu_logo: string;

    @Column()
    menu_logo_scrolled: string;

    @Column()
    title_logo: string;

    @Column()
    path_location: string;

    @Column()
    status_id: number
}