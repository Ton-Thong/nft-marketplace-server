import { UserDto } from "src/modules/user/dto/user.dto";
import { AddNFTResponseDto } from "../dto/add-nft-response.dto";
import { AddNFTDto } from "../dto/add-nft.dto";
import { BuyNftDto } from "../dto/buy-nft.dto";
import { NFTDto } from "../dto/nft.dto";

export interface INFTService {
    createNFT(p: AddNFTDto, u: UserDto): Promise<AddNFTResponseDto>;
    buyNFT(n: BuyNftDto, u: UserDto): Promise<void>;
    getNFT(id: string): Promise<NFTDto>;
    getNFTAll(): Promise<Array<NFTDto>>;
}