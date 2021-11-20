import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto } from "src/dto/response.dto";
import { CredentialDto } from "../../dto/auth/credential.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post()
    async signin(@Body() credentialDto: CredentialDto): Promise<ResponseDto> {
        try {
            const result: string = await this.authService.createToken(credentialDto);
            return { statusCode: HttpStatus.CREATED, data: result, message: 'success' };
        } catch(err) {
            throw err;
        }
    }

    @Get('')
    @UseGuards(AuthGuard())
    async get() {
        return 'Hello World';
    }
}