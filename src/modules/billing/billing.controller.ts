import { BadRequestException, Controller, Get, HttpStatus, Inject, ParseUUIDPipe, Query, Req, Scope, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDtoT } from "src/dto/response.dto";
import { ServiceInterface } from "src/helper/service-interface";
import { BillingDto } from "./dto/billing.dto";
import { IBillingService } from "./interfaces/billing.service.interface";
@Controller({ path: 'billings', scope: Scope.REQUEST })
@UsePipes(ValidationPipe)
export class BillingController {
    constructor(@Inject(ServiceInterface.IBillingService) private readonly billingService: IBillingService) { }

    @Get()
    @UseGuards(AuthGuard())
    public async getBillingById(@Query('id', ParseUUIDPipe) id: string): Promise<ResponseDtoT<BillingDto>> {
        const result: BillingDto = await this.billingService.getBillingById(id);
        if (!result) throw new BadRequestException();
        return { statusCode: HttpStatus.OK, data: result, message: 'success' }
    }

    @Get('/createBuyBilling')
    @UseGuards(AuthGuard())
    public async createBuyBilling(@Query('id') id: string, @Req() req): Promise<ResponseDtoT<string>> {
        const result: string = await this.billingService.createBuyBilling(id, req.user);
        return { statusCode: HttpStatus.OK, data: result, message: 'success' }
    }

    @Get('/createMintBilling')
    @UseGuards(AuthGuard())
    public async createMintBilling(@Query('cid') cid: string, @Req() req): Promise<ResponseDtoT<string>> {
        const result: string = await this.billingService.createMintBilling(cid, req.user);
        return { statusCode: HttpStatus.OK, data: result, message: 'success' }
    }
}