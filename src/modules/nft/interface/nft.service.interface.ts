import { NFT } from "src/models/nft.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddNFTResponseDto } from "../dto/add-nft-response.dto";
import { AddNFTDto } from "../dto/add-nft.dto";
import { NFTDto } from "../dto/nft.dto";
import { SellNftDto } from "../dto/sell-nft.dto";

export interface INFTService {
    createNFT(p: AddNFTDto, u: UserDto): Promise<AddNFTResponseDto>;
    getNFT(id: string): Promise<NFTDto>;
    getNFTAll(): Promise<Array<NFTDto>>;
    sellNFT(sellNftDto: SellNftDto, u: UserDto): Promise<void>;
}