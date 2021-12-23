import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { CredentialDto } from "./dto/credential.dto";
import { UserDto } from "../user/dto/user.dto";
import { IUserService } from "../user/interface/user.service.interface";
import { ServiceInterface } from "src/helper/service-interface";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, @Inject(ServiceInterface.IUserService) private userService: IUserService) { }

    async createToken(credentialDto: CredentialDto) {
        const { signature, publicAddress, forceTest } = credentialDto;
        if (!signature || !publicAddress) {
            throw new BadRequestException('Request should have signature and publicAddress');
        }

        try {
            const user: UserDto = await this.userService.getByPublicAddress(publicAddress);
            if (!user) {
                throw new UnauthorizedException(`User with publicAddress ${publicAddress} is not found in database`)
            }

            if (!forceTest) {
                const msgBufferHex = bufferToHex(Buffer.from(`I am signing my one-time nonce: ${user.nonce}`, 'utf8'));
                const address = recoverPersonalSignature({
                    data: msgBufferHex,
                    sig: signature,
                });

                if (address.toLowerCase() !== publicAddress.toLowerCase()) {
                    throw new UnauthorizedException('Signature verification failed');
                }
            }

            user.nonce = Math.floor(Math.random() * 10000);
            this.userService.updateNonce(user);

            return await this.jwtService.signAsync({
                payload: {
                    id: user.id,
                    publicAddress,
                },
            });
        } catch (err) {
            throw err;
        }
    }
}