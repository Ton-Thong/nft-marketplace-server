import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Billing } from "src/models/billing.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BillingDto } from "../dto/billing.dto";

export interface IBillingDao {
    createMintBilling(txFee: string, u: UserDto): Promise<MessageLayerDtoT<BillingDto>>
    getMintBilling(txFee: string, callerAddress: string, blockTimeStamp: number): Promise<MessageLayerDtoT<BillingDto>>
    getBillingById(id: string): Promise<MessageLayerDtoT<BillingDto>>
    updateMintBilling(id: string, status: string): Promise<void>
}