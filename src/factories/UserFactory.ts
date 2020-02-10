import User, { IUser } from "../models/User";

class UserFactory {
    public makeUser(): IUser {
        return new User();
    }
}

export default UserFactory;
