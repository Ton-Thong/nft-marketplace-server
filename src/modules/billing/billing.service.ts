import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { ethers } from "ethers";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import { ServiceInterface } from "src/helper/service-interface";
import { Web3Service } from "../miscellaneous/web3.service";
import { UserDto } from "../user/dto/user.dto";
import { BillingDto } from "./dto/billing.dto";
import { IBillingDao } from "./interfaces/billing.dao.interface";
import { IBillingService } from "./interfaces/billing.service.interface";

@Injectable({ scope: Scope.REQUEST })
class BillingService implements IBillingService {
    constructor(
        @Inject(DaoInterface.IBillingDao) private readonly billingDao: IBillingDao,
        private readonly web3service: Web3Service) { }

    public async createMintBilling(cid: string, u: UserDto): Promise<string> {
        const txFee: string = await this.web3service.getMintBilling(u.publicAddress, cid);
        await this.billingDao.createMintBilling(txFee, u);
        return txFee;
    }

    public async verifyBilling(txHash: string, callerAddress: string): Promise<MessageLayerDtoT<BillingDto>> {
        const transac = await this.web3service.getTransaction(txHash);
        const blockTimeStamp: number = await this.web3service.getBlock(txHash);

        if (transac.from.localeCompare(callerAddress, undefined, { sensitivity: 'accent' })) {
            throw new BadRequestException("Caller address is not owner of transaction.");
        }

        const receiveEther: string = ethers.utils.formatEther(transac.value._hex);
        const billing: MessageLayerDtoT<BillingDto> = await this.billingDao.getMintBilling(receiveEther, callerAddress, blockTimeStamp);

        return { ok: billing.ok, data: billing.data, message: billing.message };
    }

    public async getMintBillingById(id: string): Promise<BillingDto> {
        const result: MessageLayerDtoT<BillingDto> = await this.billingDao.getBillingById(id);
        if (!result.ok) throw new NotFoundException(result.message);

        return result.data;
    }

    public async updateMintBilling(id: string, status: string): Promise<void> {
        await this.billingDao.updateMintBilling(id, status);
    }
}

export const BillingServiceProvider = {
    provide: ServiceInterface.IBillingService,
    useClass: BillingService
}