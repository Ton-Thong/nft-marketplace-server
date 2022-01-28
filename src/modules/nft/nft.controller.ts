import { Body, Controller, Get, HttpStatus, Inject, ParseUUIDPipe, Post, Put, Query, Req, Scope, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { AddNFTResponseDto } from "./dto/add-nft-response.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { BuyNftDto } from "./dto/buy-nft.dto";
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
        const result: AddNFTResponseDto = await this.nftService.createNFT(nft, req.user);
        return { statusCode: HttpStatus.CREATED, data: result, message: 'success' }
    }

    @Post('/buyNFT')
    @UseGuards(AuthGuard())
    public async buyNFT(@Body() buyNFT: BuyNftDto, @Req() req): Promise<ResponseDtoT<boolean>> {
        await this.nftService.buyNFT(buyNFT, req.user);
        return { statusCode: HttpStatus.CREATED, data: null, message: 'success' }
    }

    @Put('/sellNFT')
    @UseGuards(AuthGuard())
    public async sellNFT(@Body() sellNFT: SellNftDto): Promise<ResponseDtoT<boolean>> {
        await this.nftService.sellNFT(sellNFT);
        return { statusCode: HttpStatus.OK, data: true, message: 'success' }
    }

    @Get()
    public async getNFT(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<NFTDto>> {
        const nftDto: NFTDto = await this.nftService.getNFT(id);
        return { statusCode: HttpStatus.OK, data: nftDto, message: 'success' }
    }

    @Get('/getNFTAll')
    public async getNFTAll(): Promise<ResponseDtoT<Array<NFTDto>>> {
        const nftDtos: Array<NFTDto> = await this.nftService.getNFTAll();
        return { statusCode: HttpStatus.OK, data: nftDtos, message: 'success' }
    }
}