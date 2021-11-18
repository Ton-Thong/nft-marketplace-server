import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AddProductResponseDto } from "src/dto/product/add-product-response.dto";
import { AddProductDto } from "src/dto/product/add-product.dto";
import { ResponseDto } from "src/dto/response.dto";
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
            return { statusCode: HttpStatus.CREATED, data: result,  message: 'success' }
        } catch (err) {
            throw err;
        }
    }
}