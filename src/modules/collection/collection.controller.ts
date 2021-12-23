import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, ParseUUIDPipe, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { Collection } from "src/models/collection.model";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";
import { ICollectionService } from "./interface/collection.service.interface";

@Controller('collections')
@UsePipes(ValidationPipe)
export class CollectionController {
    constructor(@Inject(ServiceInterface.ICollectionService) private collectionService: ICollectionService) { }

    @Post()
    @UseGuards(AuthGuard())
    async addCollection(@Body() collection: AddCollectionDto, @Req() req): Promise<ResponseDto> {
        try {
            const result: Collection = await this.collectionService.create(collection, req.user);
            if (!result) {
                throw new BadRequestException();
            }

            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Get()
    @UseGuards(AuthGuard())
    async getCollection(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDto> {
        try {
            const result: Collection = await this.collectionService.getById(id);
            if (!result) {
                throw new NotFoundException();
            }

            return { statusCode: HttpStatus.OK, data: result, message: 'success' }
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Get('/getAllByUser')
    @UseGuards(AuthGuard())
    async getAllByUser(@Req() req): Promise<ResponseDto> {
        try {
            const result = await this.collectionService.getAllฺByUser(req.user);
            if (!result) {
                throw new NotFoundException();
            }

            return { statusCode: HttpStatus.OK, data: result, message: 'success' };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Put()
    @UseGuards(AuthGuard())
    async updateCollectionName(@Body() uc: CollectionDto): Promise<ResponseDto> {
        try {
            await this.collectionService.updateCollectionName(uc);
            return { statusCode: HttpStatus.OK, data: true, message: 'success' };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Delete()
    @UseGuards(AuthGuard())
    async deleteCollection(@Body() collection: CollectionDto): Promise<ResponseDto> {
        try {
            await this.collectionService.delete(collection);
            return { statusCode: HttpStatus.OK, data: true, message: 'success' };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}
