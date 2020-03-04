import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public uid: number;

    @Column({
        length: 100,
        nullable: true
    })
    public displayName: string;

    @Column({
        length: 100
    })
    public email: string;

    @Column()
    public password: string;

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

}
