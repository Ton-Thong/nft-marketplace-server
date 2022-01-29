import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { ethers } from "ethers";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingCategory } from "src/helper/billing-status";
import { DaoInterface } from "src/helper/dao-interface";
import { ServiceInterface } from "src/helper/service-interface";
import { Web3Service } from "../miscellaneous/web3.service";
import { NFTDto } from "../nft/dto/nft.dto";
import { INFTDao } from "../nft/interface/nft.dao.interface";
import { UserDto } from "../user/dto/user.dto";
import { BillingDto } from "./dto/billing.dto";
import { IBillingDao } from "./interfaces/billing.dao.interface";
import { IBillingService } from "./interfaces/billing.service.interface";

@Injectable({ scope: Scope.REQUEST })
class BillingService implements IBillingService {
    constructor(
        @Inject(DaoInterface.IBillingDao) private readonly billingDao: IBillingDao,
        @Inject(DaoInterface.INFTDao) private readonly nftDao: INFTDao,
        private readonly web3service: Web3Service,
    ) { }

    public async createMintBilling(cid: string, user: UserDto): Promise<string> {
        const txFee: string = await this.web3service.getMintBilling(user.publicAddress, cid);
        await this.billingDao.createBilling(txFee, null, BillingCategory.Mint, user);
        return txFee;
    }

    public async createBuyBilling(id: string, user: UserDto): Promise<string> {

        const result: MessageLayerDtoT<NFTDto> = await this.nftDao.getNFTById(id);
        if (!result.ok) throw new NotFoundException();
        if (result.data && !result.data.sellStatus) throw new BadRequestException("Cannot buy this nft.");

        const nft = result.data;
        //const txFee: string = await this.web3service.getBuyBilling(user.publicAddress, nft.tokenId);
        const listingPrice: number = 0.01;
        const txFeeComplete: string = (listingPrice + nft.currentPrice).toString();
        await this.billingDao.createBilling(txFeeComplete, nft.tokenId, BillingCategory.Buy, user);

        return txFeeComplete;
    }

    public async verifyBilling(txHash: string, callerAddress: string, billingCate: BillingCategory): Promise<MessageLayerDtoT<BillingDto>> {
        const transac = await this.web3service.getTransaction(txHash);

        if (transac.from.localeCompare(callerAddress, undefined, { sensitivity: 'accent' })) {
            throw new BadRequestException("Caller address is not owner of transaction.");
        }

        const receiveEther: string = ethers.utils.formatEther(transac.value._hex);
        const billing: MessageLayerDtoT<BillingDto> = await this.billingDao.getBilling(receiveEther, callerAddress, billingCate);
        return { ok: billing.ok, data: billing.data, message: billing.message };
    }

    public async getBillingById(id: string): Promise<BillingDto> {
        const result: MessageLayerDtoT<BillingDto> = await this.billingDao.getBillingById(id);
        if (!result.ok) throw new NotFoundException(result.message);
        return result.data;
    }

    public async updateTokenIdBilling(id: string, tokenId: number): Promise<void> {
        await this.billingDao.updateBillingByExpression(id, {
            UpdateExpression: "set #tokenId = :tokenId",
            ExpressionAttributeNames: { '#tokenId': 'tokenId' },
            ExpressionAttributeValues: { ":tokenId": tokenId }
        });
    }

    public async updateBilling(id: string, status: string): Promise<void> {
        await this.billingDao.updateBillingByExpression(id, {
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ":status": status }
        });
    }
}

export const BillingServiceProvider = {
    provide: ServiceInterface.IBillingService,
    useClass: BillingService
}