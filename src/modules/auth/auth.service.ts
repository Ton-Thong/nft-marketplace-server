import { Injectable } from "@nestjs/common";
import { MessageLayerDto } from "src/dto/message-layer-dto";
import { CreateTokenDto } from "./dto/create-token-dto";

@Injectable()
export class AuthService {
    constructor() { }

    async create(createTokenDto : CreateTokenDto) {
        const { signature, publicAddress } = createTokenDto;
        if(!signature || !publicAddress) {
            return new MessageLayerDto(false, null, 'Request should have signature and publicAddress')
        }

        try
        {

        }
        catch(err)
        {

        }
    }
}