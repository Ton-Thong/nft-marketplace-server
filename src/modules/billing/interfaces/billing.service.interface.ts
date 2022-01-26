import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingCategory } from "src/helper/billing-status";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BillingDto } from "../dto/billing.dto";

export interface IBillingService {
    createMintBilling(cid: string, u: UserDto): Promise<string>;
    verifyBilling(txHash: string, callerAddress: string, billingCate: BillingCategory): Promise<MessageLayerDtoT<BillingDto>>;
    getBillingById(id: string): Promise<BillingDto>;
    updateTokenIdBilling(id: string, tokenId: number): Promise<void>;
    updateBilling(id: string, status: string): Promise<void>;
}