import { DynamoExpression } from "src/dto/dynamoExpression.dto";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddNFTDto } from "../dto/add-nft.dto";
import { NFTDto } from "../dto/nft.dto";
import { SellNftDto } from "../dto/sell-nft.dto";

export interface INFTDao {
    createNFT(p: AddNFTDto, u: UserDto, nftTxHash: string, tokenId: number): Promise<MessageLayerDtoT<string>>;
    getNFTById(id: string): Promise<MessageLayerDtoT<NFTDto>>;
    getNFTAll(): Promise<MessageLayerDtoT<Array<NFTDto>>>;
    updateSellNFT(sellNFT: SellNftDto): Promise<void>;
}