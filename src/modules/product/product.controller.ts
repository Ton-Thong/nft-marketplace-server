import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, ParseUUIDPipe, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AddProductResponseDto } from "src/dto/product/add-product-response.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { ResponseDto } from "src/dto/response.dto";
import { Product } from "src/models/product.model";
import { ProductService } from "./product.service";

@Controller('products')
@UsePipes(ValidationPipe)
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseGuards(AuthGuard())
    async addProduct(@Body() product: AddProductDto, @Req() req): Promise<ResponseDto> {
        try {
            const result: AddProductResponseDto = await this.productService.create(product, req.user);
            if(!result) {
                throw new BadRequestException();
            }

            return { statusCode: HttpStatus.CREATED, data: result,  message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get()
    @UseGuards(AuthGuard())
    async getProduct(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDto> {
        try {
            const result: Product = await this.productService.get(id);
            if(!result) {
                throw new NotFoundException();
            }

            return { statusCode: HttpStatus.OK, data: result,  message: 'success' }
        } catch(err) {
            throw err;
        }
    }
}