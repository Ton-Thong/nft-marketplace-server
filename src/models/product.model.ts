export class Product {
    constructor() {
        this.createdDate = new Date().toLocaleString();
        this.currentPrice = 0;
        this.lastPrice = 0;
        this.sellStatus = false;
        this.contractAddress = "";
    }

    public id: string;
    public name: string;
    public imageName: string;
    public description: string;
    public sellStatus: boolean;
    public lastPrice: number;
    public currentPrice: number;
    public owner: string;
    public createdBy: string;
    public createdDate: string;
    public contractAddress: string;
}