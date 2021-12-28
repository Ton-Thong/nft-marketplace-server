export class NFTDto {
    constructor() {
        this.createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
        this.currentPrice = 0;
        this.lastPrice = 0;
        this.sellStatus = false;
    }

    public mapper(n: any) {
        this.id = n.id;
        this.name = n.name;
        this.fileName = n.fileName;
        this.fileType = n.fileType;
        this.collectionId = n.collectionId;
        this.collectionName = n.collectionName;
        this.description = n.description;
        this.sellStatus = n.sellStatus;
        this.lastPrice = n.lastPrice;
        this.currentPrice = n.currentPrice;
        this.owner = n.owner;
        this.createdBy = n.createdBy;
        this.createdDate = n.createdDate;
        this.cid = n.cid;
        this.metadata = n.metadata;
        this.nftTxHash = n.nftTxHash;
        this.tokenId = n.tokenId;
        this.createdDate = n.createdDate;
    }

    public id: string;
    public name: string;
    public fileName: string;
    public fileType: string;
    public collectionId: string;
    public collectionName: string;
    public description: string;
    public sellStatus: boolean = false;
    public lastPrice: number = 0;
    public currentPrice: number;
    public owner: string;
    public createdBy: string;
    public createdDate: string;
    public cid: string;
    public metadata:string;
    public nftTxHash: string;
    public tokenId: number;
}