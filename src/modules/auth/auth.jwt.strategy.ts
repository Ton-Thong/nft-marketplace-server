import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ServiceInterface } from "src/helper/service-interface";
import { IUserService } from "../user/interface/user.service.interface";

export class AuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(token) { //Performance Issue - Query per Request
        try {
            return token.payload;
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}