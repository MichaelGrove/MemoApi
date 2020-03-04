import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Memo} from "./Memo";

@Entity()
export class MemoCategory {

    @PrimaryGeneratedColumn()
    public cid: number;

    @Column("varchar", { length: 100 })
    public label: string;

    @Column("varchar", { length: 100 })
    public color: string;

    // tslint:disable-next-line: variable-name
    @ManyToMany((type) => Memo, (memo) => memo.categories)
    @JoinTable()
    public memos: Memo[];

}
