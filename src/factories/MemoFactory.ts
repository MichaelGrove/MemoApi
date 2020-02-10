import Memo, { IMemo } from "../models/Memo";

class MemoFactory {
    public makeMemo(): IMemo {
        return new Memo();
    }
}

export default MemoFactory;
