import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, ParseUUIDPipe, Post, Put, Query, Req, Res, Scope, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto, ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";
import { ICollectionService } from "./interface/collection.service.interface";

@Controller({ path: 'collections', scope: Scope.REQUEST })
@UsePipes(ValidationPipe)
export class CollectionController {
    constructor(@Inject(ServiceInterface.ICollectionService) private collectionService: ICollectionService) { }

    @Post()
    @UseGuards(AuthGuard())
    async createCollection(@Body() collection: AddCollectionDto, @Req() req): Promise<ResponseDtoT<CollectionDto>> {
        try {
            const collectionDto: CollectionDto = await this.collectionService.createCollection(collection, req.user);
            return { statusCode: HttpStatus.CREATED, data: collectionDto, message: 'success' };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Get()
    @UseGuards(AuthGuard())
    async getCollection(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<CollectionDto>> {
        try {
            const collectionDto: CollectionDto = await this.collectionService.getCollectionById(id);
            return { statusCode: HttpStatus.OK, data: collectionDto, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get('/getAllByUser')
    @UseGuards(AuthGuard())
    async getAllByUser(@Req() req): Promise<ResponseDtoT<CollectionDto[]>> {
        try {
            const collections: Array<CollectionDto> = await this.collectionService.getCollectionAllฺByUser(req.user);
            return { statusCode: HttpStatus.OK, data: collections, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    @Put()
    @UseGuards(AuthGuard())
    async updateCollectionName(@Body() uc: CollectionDto): Promise<ResponseDtoT<boolean>> {
        try {
            await this.collectionService.updateCollectionName(uc);
            return { statusCode: HttpStatus.OK, data: true, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    @Delete()
    @UseGuards(AuthGuard())
    async deleteCollection(@Body() collection: CollectionDto): Promise<ResponseDtoT<boolean>> {
        try {
            await this.collectionService.deleteCollection(collection);
            return { statusCode: HttpStatus.OK, data: true, message: 'success' };
        } catch (err) {
            throw err;
        }
    }
}
