import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingStatus } from "src/helper/billing-status";
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
import { SellNftDto } from "./dto/sell-nft.dto";

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
        if (!n.forceTest) {
            const verified: MessageLayerDtoT<BillingDto> = await this.billingService.verifyBilling(n.txHash, u.publicAddress);
            if (!verified.ok) throw new BadRequestException("Transaction is not valid.");

            await this.billingService.updateMintBilling(verified.data.id, BillingStatus.Success);
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

        return { id: nft.data, s3Url: signedUrl };
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
        const signedUrls: Array<string> = await Promise.all(nfts.map((nft) => this.fileService.getSignedUrlGetObject(this.busketName, nft.fileName)));

        return nfts.map((nft) => {
            nft.fileName = signedUrls.find(signedUrl => signedUrl.includes(nft.fileName));
            return nft;
        }).sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
    }

    public async sellNFT(sellNftDto: SellNftDto, u: UserDto): Promise<void> {
        const { nftId, price } = sellNftDto;
        const result: MessageLayerDtoT<NFTDto> = await this.nftDao.getNFTById(nftId);
        if (!result.ok) {
            throw new BadRequestException(result.message);
        }

        const nft = result.data;
        if (nft.owner != u.id) {
            throw new BadRequestException("");
        }

        await this.web3service.sellNFT(nft.tokenId, price);
        await this.nftDao.updateSellStatus(u);
    }
}

export const NFTServiceProvider = {
    provide: ServiceInterface.INFTService,
    useClass: NFTService
}