import { Injectable, Scope } from "@nestjs/common";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import { NFT, NFTModel } from "src/models/nft.model";
import { UserDto } from "../user/dto/user.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { INFTDao } from "./interface/nft.dao.interface";
import { v4 as uuid } from 'uuid';
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";

@Injectable({ scope: Scope.REQUEST })
class NFTDao implements INFTDao {
    constructor(private readonly nftModel: NFTModel) { }
    public async createNFT(p: AddNFTDto, u: UserDto, nftTxHash: string, tokenId: number): Promise<MessageLayerDtoT<NFT>> {
        const id = (uuid()).toString();
        const newNFT = {
            id,
            ...p,
            nftTxHash: nftTxHash,
            createdBy: u.id,
            owner: u.id,
            tokenId: tokenId,
        }

        const nft: NFT = await this.nftModel.client.create(newNFT);
        return { ok: true, data: nft, message: 'success' };
    }

    public async getNFTById(id: string): Promise<MessageLayerDtoT<NFT>> {
        const nft: NFT = await this.nftModel.client.get({ id });
        if (!nft) {
            return { ok: false, data: null, message: `NFT key is not found in database` };
        }
        return { ok: true, data: nft, message: `success` };
    }

    public async getNFTAll(): Promise<MessageLayerDtoT<NFT[]>> {
        const nfts: ScanResponse<NFT> = await this.nftModel.client.scan().exec()

        return !nfts || nfts.count <= 0
            ? { ok: false, data: null, message: 'NFT is not found in database' }
            : { ok: true, data: nfts, message: 'success' };
    }
}

export const NFTDaoProvider = {
    provide: DaoInterface.INFTDao,
    useClass: NFTDao
}