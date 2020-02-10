import { IMemoCategory } from "./MemoCategory";

interface IMemo {
    mid: number;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    isFavourite: number;
    isHidden: number;
    categories: IMemoCategory[];
}

class Memo implements IMemo {
    public mid: number;
    public title: string;
    public message: string;
    public createdAt: string;
    public updatedAt: string;
    public isFavourite: number;
    public isHidden: number;
    public categories: IMemoCategory[];
}

export { IMemo, Memo };
export default Memo;
