import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ServiceInterface } from "src/helper/service-interface";
import { UserServiceInterface } from "../user/interface/user.service.interface";

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(ServiceInterface.UserServiceInterface) private userService: UserServiceInterface) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(token) { //Performance Issue - Query per Request
        try {
            const { id, publicAddress } = token.payload;
            return await this.userService.getByKey(id, publicAddress);
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}