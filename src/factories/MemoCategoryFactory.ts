import { IMemoCategory, MemoCategory } from "../models/MemoCategory";

class MemoCategoryFactory {
    public makeCategory(): IMemoCategory {
        return new MemoCategory();
    }
}

export default MemoCategoryFactory;
