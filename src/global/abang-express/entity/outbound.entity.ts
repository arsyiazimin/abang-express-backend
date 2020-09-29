import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('outbound', { database: 'abaj2285_ax' })
export class outBound {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    resi: string

    @Column()
    tanggal: Date;

    @Column()
    pcs: number

    @Column()
    counter: number
}