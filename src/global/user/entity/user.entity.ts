import { Entity, PrimaryColumn, Column, AdvancedConsoleLogger, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserLogin } from 'global/user-login/entity/userLogin.entity';

@Entity('m_user')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    first_name: string;
    
    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    status_id: number;

    @Column()
    create_date: Date;

    @Column()
    update_date: Date;

    @OneToOne(type => UserLogin, emp => emp.employee, { cascade: ["insert", "update"], onDelete: 'CASCADE' })
    user_login: UserLogin

}