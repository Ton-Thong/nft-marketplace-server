import { DynamoExpression } from "src/dto/dynamoExpression.dto";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { BillingCategory } from "src/helper/billing-status";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BillingDto } from "../dto/billing.dto";

export interface IBillingDao {
    createBilling(txFee: string, billingCate: BillingCategory, user: UserDto): Promise<MessageLayerDtoT<BillingDto>>;
    getBilling(txFee: string, callerAddress: string, billingCate: BillingCategory): Promise<MessageLayerDtoT<BillingDto>>;
    getBillingById(id: string): Promise<MessageLayerDtoT<BillingDto>>;
    updateBillingByExpression(id: string, expression: DynamoExpression): Promise<void>;
}