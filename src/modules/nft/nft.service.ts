import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingCategory, BillingStatus } from "src/helper/billing-status";
import { DaoInterface } from "src/helper/dao-interface";
import { ServiceInterface } from "src/helper/service-interface";
import { NFT } from "src/models/nft.model";
import { IBillingService } from "../billing/interfaces/billing.service.interface";
import { FileService } from "../miscellaneous/file.service";
import { IpfsService } from "../miscellaneous/ipfs.service";
import { Web3Service } from "../miscellaneous/web3.service";
import { UserDto } from "../user/dto/user.dto";
import { AddNFTResponseDto } from "./dto/add-nft-response.dto";
import { NFTDto } from "./dto/nft.dto";
import { INFTDao } from "./interface/nft.dao.interface";
import { INFTService } from "./interface/nft.service.interface";
import { BillingDto } from "../billing/dto/billing.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { BuyNftDto } from "./dto/buy-nft.dto";

@Injectable({ scope: Scope.REQUEST })
class NFTService implements INFTService {
    private readonly busketName: string;
    constructor(
        @Inject(DaoInterface.INFTDao) private readonly nftDao: INFTDao,
        @Inject(ServiceInterface.IBillingService) private readonly billingService: IBillingService,
        private readonly fileService: FileService,
        private readonly ipfsService: IpfsService,
        private readonly web3service: Web3Service) {
        this.busketName = process.env.S3_BUCKETNAME;
    }

    public async createNFT(n: AddNFTDto, u: UserDto): Promise<AddNFTResponseDto> {
        let billingId;
        if (!n.forceTest) {
            billingId = this.verifyBilling(n.txHash, u.publicAddress, BillingCategory.Mint);
        }

        n.fileName = `${uuid()}-${n.fileName}`;
        const [signedUrl, _, minted] = await Promise.all([
            this.fileService.getSignedUrlPutObject(this.busketName, n.fileName, n.fileType),
            this.ipfsService.pinCid([n.cid, n.metadata]),
            this.web3service.mintNFT(u.publicAddress, n.metadata + "/metadata.json")
        ]);

        const event = minted.events[0];
        const value = event.args[2];
        const tokenId: number = value.toNumber();
        const nft: MessageLayerDtoT<string> = await this.nftDao.createNFT(n, u, minted.transactionHash, tokenId);
        await this.billingService.updateTokenIdBilling(billingId, tokenId);

        return { id: nft.data, s3Url: signedUrl };
    }

    public async buyNFT(n: BuyNftDto, u: UserDto): Promise<void> {
        let billingId;
        if (!n.forceTest) {
            billingId = this.verifyBilling(n.txHash, u.publicAddress, BillingCategory.Buy);
        }

        await this.web3service.buyNFT(u.publicAddress, n.tokenId);
        await this.billingService.updateTokenIdBilling(billingId, n.tokenId);
    }

    public async getNFT(id: string): Promise<NFTDto> {
        const result: MessageLayerDtoT<NFTDto> = await this.nftDao.getNFTById(id);
        if (!result.ok) {
            throw new NotFoundException(result.message);
        }

        const nft: NFT = result.data;
        nft.fileName = await this.fileService.getSignedUrlGetObject(this.busketName, nft.fileName);
        return nft
    }

    public async getNFTAll(): Promise<Array<NFTDto>> {
        const result: MessageLayerDtoT<Array<NFTDto>> = await this.nftDao.getNFTAll();
        if (!result.ok) {
            throw new NotFoundException(result.message);
        }

        const nfts: Array<NFTDto> = result.data;
        const signedUrls: Array<string> = await Promise.all(nfts.filter(nft => nft.fileName).map((nft) => this.fileService.getSignedUrlGetObject(this.busketName, nft.fileName)));
        return nfts.map((nft) => {
            nft.fileName = signedUrls.find(signedUrl => signedUrl.includes(nft.fileName));
            return nft;
        }).sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
    }

    private async verifyBilling(txHash: string, publicAddress: string, billingCategory: BillingCategory) {
        const verified: MessageLayerDtoT<BillingDto> = await this.billingService.verifyBilling(txHash, publicAddress, billingCategory);
        if (!verified.ok) {
            await this.billingService.updateBilling(verified.data.id, BillingStatus.Failed);
            throw new BadRequestException("Transaction is not valid.");
        }
        await this.billingService.updateBilling(verified.data.id, BillingStatus.Success);
        return verified.data.id;
    }
}

export const NFTServiceProvider = {
    provide: ServiceInterface.INFTService,
    useClass: NFTService
}