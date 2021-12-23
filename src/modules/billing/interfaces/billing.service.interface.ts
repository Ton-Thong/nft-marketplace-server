import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BillingDto } from "../dto/billing.dto";

export interface IBillingService {
    createMintBilling(cid: string, u: UserDto): Promise<string>;
    verifyBilling(txHash: string, callerAddress: string): Promise<MessageLayerDtoT<BillingDto>>;
    getMintBillingById(id: string): Promise<BillingDto>;
    updateMintBilling(id: string, status: string): Promise<void>;
}