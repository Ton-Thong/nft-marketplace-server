import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService : UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }) 
    }

    async validate(token) { //Performance Issue - Query per Request
        const { id, publicAddress } = token.payload;
        const user = await this.userService.get(id, publicAddress);

        if(!user.ok) {
            throw new UnauthorizedException(user.message);
        }

        return user.data;
    }
}