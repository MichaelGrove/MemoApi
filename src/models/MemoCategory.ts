interface IMemoCategory {
    cid: number;
    label: string;
    color: string;
}

class MemoCategory implements IMemoCategory {
    public cid: number;
    public label: string;
    public color: string;
}

export default MemoCategory;
export { MemoCategory, IMemoCategory };
