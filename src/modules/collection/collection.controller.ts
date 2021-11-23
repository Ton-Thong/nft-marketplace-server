import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, ParseUUIDPipe, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AddCollectionDto } from "src/dto/collection/add-collection.dto";
import { CollectionDto } from "src/dto/collection/collection.dto";
import { ResponseDto } from "src/dto/response.dto";
import { Collection } from "src/models/collection.model";
import { CollectionService } from "./collection.service";

@Controller('collections')
@UsePipes(ValidationPipe)
export class CollectionController {
    constructor(private collectionService: CollectionService) { }

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
            throw err;
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
            throw err;
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
            throw err;
        }
    }

    @Put()
    @UseGuards(AuthGuard())
    async updateCollectionName(@Body() uc: CollectionDto): Promise<ResponseDto> {
        try {
            const ok: boolean = await this.collectionService.updateCollectionName(uc);
            if (!ok) {
                throw new BadRequestException();
            }

            return { statusCode: HttpStatus.OK, data: ok, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    @Delete()
    @UseGuards(AuthGuard())
    async deleteCollection(@Body() collection: CollectionDto): Promise<ResponseDto> {
        try {
            const ok: boolean = await this.collectionService.delete(collection);
            if (!ok) {
                throw new BadRequestException();
            }

            return { statusCode: HttpStatus.OK, data: null, message: 'success' };
        } catch (err) {
            throw err;
        }
    }
}
