import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { NFT } from "src/models/nft.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddNFTDto } from "../dto/add-nft.dto";

export interface INFTDao {
    createNFT(p: AddNFTDto, u: UserDto, nftTxHash: string): Promise<MessageLayerDtoT<NFT>>;
    getNFTById(id: string): Promise<MessageLayerDtoT<NFT>>;
    getNFTAll(): Promise<MessageLayerDtoT<NFT[]>>
}