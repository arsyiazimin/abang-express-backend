
import { Entity, PrimaryColumn, Column, AdvancedConsoleLogger, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../global/user/entity/user.entity';

@Entity('t_user_login')
export class UserLogin {
    @PrimaryGeneratedColumn()
    login_id: number;

    @Column()
    user_id: number;

    @Column()
    login_code: string;

    @Column()
    login_pass: string;

    @Column()
    s_pass: string;
    
    @Column()
    status_id: number;

    @Column()
    is_dev: number;

    @OneToOne(type => User, emp => emp.user_login, { cascade: ["insert", "update"], onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    employee: User

}