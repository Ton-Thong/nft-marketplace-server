import { Body, Controller, Get, HttpStatus, Inject, ParseUUIDPipe, Post, Query, Req, Scope, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { resourceLimits } from "worker_threads";
import { UserDto } from "../user/dto/user.dto";
import { AddNFTResponseDto } from "./dto/add-nft-response.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { NFTDto } from "./dto/nft.dto";
import { SellNftDto } from "./dto/sell-nft.dto";
import { INFTService } from "./interface/nft.service.interface";

@Controller({ path: 'nfts', scope: Scope.REQUEST })
@UsePipes(ValidationPipe)
export class NFTController {
    constructor(@Inject(ServiceInterface.INFTService) private readonly nftService: INFTService) { }

    @Post()
    @UseGuards(AuthGuard())
    public async createNFT(@Body() nft: AddNFTDto, @Req() req): Promise<ResponseDtoT<AddNFTResponseDto>> {
        try {
            const result: AddNFTResponseDto = await this.nftService.createNFT(nft, req.user);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get()
    public async getNFT(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<NFTDto>> {
        try {
            const nftDto: NFTDto = await this.nftService.getNFT(id);
            return { statusCode: HttpStatus.OK, data: nftDto, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get('/getNFTAll')
    public async getNFTAll(): Promise<ResponseDtoT<Array<NFTDto>>> {
        try {
            const nftDtos: Array<NFTDto> = await this.nftService.getNFTAll();
            return { statusCode: HttpStatus.OK, data: nftDtos, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Post('/sellNFT')
    @UseGuards(AuthGuard())
    public async sellNFT(@Body() sellNFT: SellNftDto, @Req() req): Promise<ResponseDtoT<SellNftDto>> {
        try {
            await this.nftService.sellNFT(sellNFT, req.user);
            return { statusCode: HttpStatus.CREATED, data: null, message: 'sucess' };
        } catch(err) {
            throw err;
        }
    }
}