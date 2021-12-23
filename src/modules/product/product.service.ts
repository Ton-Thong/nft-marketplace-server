import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { v4 as uuid } from 'uuid';
import { AddProductResponseDto } from "src/modules/product/dto/add-product-response.dto";
import { AddProductDto } from "src/modules/product/dto/add-product.dto";
import { FileService } from "../miscellaneous/file.service";
import { ProductRepository } from "./product.repository";
import { Product } from "src/models/product.model";
import { UserDto } from "../user/dto/user.dto";
import { IpfsService } from "../miscellaneous/ipfs.service";
import { Web3Service } from "../miscellaneous/web3.service";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { BillingStatus } from "src/helper/billing-status";
import { ServiceInterface } from "src/helper/service-interface";
import { IBillingService } from "../billing/interfaces/billing.service.interface";

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  private readonly busketName: string;
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(ServiceInterface.IBillingService) private readonly billingService: IBillingService,
    private readonly fileService: FileService,
    private readonly ipfsService: IpfsService,
    private readonly web3service: Web3Service) {
    this.busketName = process.env.S3_BUCKETNAME;
  }

  public async create(p: AddProductDto, u: UserDto): Promise<AddProductResponseDto> {
    const verified: MessageLayerDto = await this.billingService.verifyBilling(p.txHash, u.publicAddress);
    if (!verified.ok) throw new BadRequestException("Transaction is not valid.");

    await this.billingService.updateMintBilling(verified.data.id, BillingStatus.Success);

    p.fileName = `${uuid()}-${p.fileName}`;
    const [signedUrl, _, minted] = await Promise.all([
      this.fileService.getSignedUrlPutObject(this.busketName, p.fileName, p.fileType),
      this.ipfsService.pinCid([p.cid, p.metadata]),
      this.web3service.mintNFT(u.publicAddress, p.metadata + "/metadata.json")
    ]);

    const result = await this.productRepository.create(p, u, minted.transactionHash);
    return { id: result.data, s3Url: signedUrl };
  }

  public async get(id: string): Promise<Product> {
    const result = await this.productRepository.get(id);
    if (!result.ok) return null;

    const p: Product = result.data;
    p.fileName = await this.fileService.getSignedUrlGetObject(this.busketName, p.fileName);
    return p;
  }

  public async getAll(): Promise<Array<Product>> {
    const result = await this.productRepository.getAll();
    if (!result.ok) return null;

    const products: Array<Product> = result.data;
    products.forEach(async (_, index) => {
      products[index].fileName = await this.fileService.getSignedUrlGetObject(this.busketName, products[index].fileName);
    })

    return products.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
  }
}