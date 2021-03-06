import { BadRequestException, Controller, Get, HttpStatus, Inject, ParseUUIDPipe, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto, ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { BillingDto } from "./dto/billing.dto";
import { IBillingService } from "./interfaces/billing.service.interface";

@Controller('billings')
@UsePipes(ValidationPipe)
export class BillingController {
    constructor(@Inject(ServiceInterface.IBillingService) private readonly billingService: IBillingService) { }

    @Get()
    @UseGuards(AuthGuard())
    public async getMintBillingById(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<BillingDto>> {
        try {
            const result: BillingDto = await this.billingService.getMintBillingById(id);
            if (!result) throw new BadRequestException();

            return { statusCode: HttpStatus.OK, data: result, message: 'success' }
        } catch (err) {
            throw err;
        }
    }

    @Get('/createMintBilling')
    @UseGuards(AuthGuard())
    public async createMintBilling(@Query('cid') cid: string, @Req() req): Promise<ResponseDtoT<string>> {
        try {
            const result: string = await this.billingService.createMintBilling(cid, req.user);
            return { statusCode: HttpStatus.OK, data: result, message: 'success' }
        } catch (err) {
            throw err;
        }
    }
}