export class Collection {
    constructor() {
        this.createdDate = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    }
    public id: string;
    public name: string;
    public createdBy: string;
    public createdDate: string;
}