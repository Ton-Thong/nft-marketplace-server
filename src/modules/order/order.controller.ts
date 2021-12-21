import { BadRequestException, Controller, Get, HttpStatus, ParseUUIDPipe, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto } from "src/dto/response.dto";
import { OrderService } from "./order.service";

@Controller('orders')
@UsePipes(ValidationPipe)
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get()
    @UseGuards(AuthGuard())
    public async getMintBillingById(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDto> {
        try {
            const result = await this.orderService.getMintBillingById(id);
            if (!result) throw new BadRequestException();

            return { statusCode: HttpStatus.OK, data: result, message: 'success' }
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Get('/createMintBilling')
    @UseGuards(AuthGuard())
    public async createMintBilling(@Query('cid') cid: string, @Req() req): Promise<ResponseDto> {
        try {
            const result = await this.orderService.createMintBilling(cid, req.user);
            if (!result) throw new BadRequestException();

            return { statusCode: HttpStatus.OK, data: result, message: 'success' }
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}