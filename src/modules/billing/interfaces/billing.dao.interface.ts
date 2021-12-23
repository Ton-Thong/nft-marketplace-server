import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Billing } from "src/models/billing.model";
import { UserDto } from "src/modules/user/dto/user.dto";

export interface IBillingDao {
    createMintBilling(txFee: string, u: UserDto): Promise<MessageLayerDtoT<Billing>>
    getMintBilling(txFee: string, callerAddress: string, blockTimeStamp: number): Promise<MessageLayerDtoT<Billing>>
    updateMintBilling(id: string, status: string): Promise<void>
    getBillingById(id: string): Promise<MessageLayerDtoT<Billing>>
}