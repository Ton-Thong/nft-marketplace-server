import { NFT } from "src/models/nft.model";
import { AddProductDto } from "src/modules/product/dto/add-product.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddNFTResponseDto } from "../dto/add-nft-response.dto";
import { NFTDto } from "../dto/nft.dto";

export interface INFTService {
    createNFT(p: AddProductDto, u: UserDto): Promise<AddNFTResponseDto>;
    getNFT(id: string): Promise<NFTDto>;
    getNFTAll(): Promise<Array<NFTDto>>;
}