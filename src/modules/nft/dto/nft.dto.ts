import { NFT } from "src/models/nft.model";

export class NFTDto {
    constructor(n: NFT) {
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
        this.contractAddress = n.contractAddress;
        this.cid = n.cid;
        this.nftTxHash = n.nftTxHash;
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
    public currentPrice: number = 0;
    public owner: string;
    public createdBy: string;
    public createdDate: string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    public contractAddress: string;
    public cid: string;
    public nftTxHash: string;
}