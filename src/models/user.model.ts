export class User {
    constructor(u: any) {
        const { id, publicAddress, nonce, username, avatar, description } = u;
        this.id = id;
        this.publicAddress = publicAddress;
        this.nonce = nonce;
        this.username = username;
        this.avatar = avatar
        this.description = description;
    }
    public id: string;
    public publicAddress: string;
    public nonce: number;
    public username: string;
    public avatar: string;
    public description: string;
}