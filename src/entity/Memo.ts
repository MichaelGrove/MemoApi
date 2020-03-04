import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { MemoCategory } from "./MemoCategory";

@Entity()
export class Memo {

    @PrimaryGeneratedColumn()
    public mid: number;

    @Column("varchar", {
        length: 255
    })
    public title: string;

    @Column("mediumtext")
    public message: string;

    @Column("datetime")
    public createdAt: Date;

    @Column("datetime")
    public updatedAt: Date;

    @Column("tinyint")
    public isFavourite: number;

    @Column("tinyint")
    public isHidden: number;

    // tslint:disable-next-line: variable-name
    @ManyToMany((_type) => MemoCategory, (category) => category.memos)
    @JoinTable()
    public categories: MemoCategory[];

}
