interface IUser {
    uid: number;
    displayName: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

class User implements IUser {
    public uid: number;
    public displayName: string;
    public email: string;
    public password: string;
    public createdAt: string;
    public updatedAt: string;

}

export { IUser, User };
export default User;
