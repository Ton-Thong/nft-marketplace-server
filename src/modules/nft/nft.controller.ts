import { Body, Controller, Get, HttpStatus, Inject, ParseUUIDPipe, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { AddNFTResponseDto } from "./dto/add-nft-response.dto";
import { AddNFTDto } from "./dto/add-nft.dto";
import { NFTDto } from "./dto/nft.dto";
import { INFTService } from "./interface/nft.service.interface";

@Controller('nfts')
@UsePipes(ValidationPipe)
export class NFTController {
    constructor(@Inject(ServiceInterface.INFTService) private readonly nftService: INFTService) { }

    @Post()
    @UseGuards(AuthGuard())
    async createNFT(@Body() nft: AddNFTDto, @Req() req): Promise<ResponseDtoT<AddNFTResponseDto>> {
        try {
            const result: AddNFTResponseDto = await this.nftService.createNFT(nft, req.user);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get()
    async getProduct(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<NFTDto>> {
        try {
            const nftDto: NFTDto = await this.nftService.getNFT(id);
            return { statusCode: HttpStatus.OK, data: nftDto, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get('/getNFTAll')
    async getProductAll(): Promise<ResponseDtoT<Array<NFTDto>>> {
        try {
            const nftDtos: Array<NFTDto> = await this.nftService.getNFTAll();
            return { statusCode: HttpStatus.OK, data: nftDtos, message: 'success' }
        } catch (err) {
            throw err;
        }
    }
}