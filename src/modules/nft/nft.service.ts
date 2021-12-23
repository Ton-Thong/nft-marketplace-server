import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingStatus } from "src/helper/billing-status";
import { DaoInterface } from "src/helper/dao-interface";
import { ServiceInterface } from "src/helper/service-interface";
import { Billing } from "src/models/billing.model";
import { NFT } from "src/models/nft.model";
import { IBillingService } from "../billing/interfaces/billing.service.interface";
import { FileService } from "../miscellaneous/file.service";
import { IpfsService } from "../miscellaneous/ipfs.service";
import { Web3Service } from "../miscellaneous/web3.service";
import { AddProductDto } from "../product/dto/add-product.dto";
import { UserDto } from "../user/dto/user.dto";
import { AddNFTResponseDto } from "./dto/add-nft-response.dto";
import { NFTDto } from "./dto/nft.dto";
import { INFTDao } from "./interface/nft.dao.interface";
import { INFTService } from "./interface/nft.service.interface";
import { BillingDto } from "../billing/dto/billing.dto";

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

    public async createNFT(p: AddProductDto, u: UserDto): Promise<AddNFTResponseDto> {
        if(!p.forceTest) {
            const verified: MessageLayerDtoT<BillingDto> = await this.billingService.verifyBilling(p.txHash, u.publicAddress);
            if (!verified.ok) throw new BadRequestException("Transaction is not valid.");
    
            await this.billingService.updateMintBilling(verified.data.id, BillingStatus.Success);
        }

        p.fileName = `${uuid()}-${p.fileName}`;
        const [signedUrl, _, minted] = await Promise.all([
            this.fileService.getSignedUrlPutObject(this.busketName, p.fileName, p.fileType),
            this.ipfsService.pinCid([p.cid, p.metadata]),
            this.web3service.mintNFT(u.publicAddress, p.metadata + "/metadata.json")
        ]);

        const nft: MessageLayerDtoT<NFT> = await this.nftDao.createNFT(p, u, minted.transactionHash);
        return { id: nft.data.id, s3Url: signedUrl };
    }

    public async getNFT(id: string): Promise<NFTDto> {
        const result: MessageLayerDtoT<NFT> = await this.nftDao.getNFTById(id);
        if (!result.ok) {
            throw new NotFoundException(result.message);
        }
        const nft: NFT = result.data;
        nft.fileName = await this.fileService.getSignedUrlGetObject(this.busketName, nft.fileName);
        return new NFTDto(nft);
    }

    public async getNFTAll(): Promise<Array<NFTDto>> {
        const result: MessageLayerDtoT<NFT[]> = await this.nftDao.getNFTAll();
        if (!result.ok) {
            throw new NotFoundException(result.message);
        }

        const nfts = result.data;
        nfts.forEach(async (_, index) => {
            nfts[index].fileName = await this.fileService.getSignedUrlGetObject(this.busketName, nfts[index].fileName);
        })

        return nfts.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1)).map(e => new NFTDto(e));
    }
}

export const NFTServiceProvider = {
    provide: ServiceInterface.INFTService,
    useClass: NFTService
}