import { Injectable, Scope } from "@nestjs/common";
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { User, UserModel } from "src/models/user.model";
import { AddUserDto } from "./dto/add-user.dto";
import { UserDaoInterface } from "./interface/user.dao.interface";
import { v4 as uuid } from 'uuid';
import { UserDto } from "./dto/user.dto";

@Injectable({ scope: Scope.REQUEST })
class UserDao implements UserDaoInterface {
    constructor(private userModel: UserModel) { }
    public async createUser(u: AddUserDto): Promise<MessageLayerDtoT<User>> {
        const { publicAddress, username } = u;
        const nonce: number = Math.floor(Math.random() * 10000);
        const newUser = { id: uuid(), publicAddress, username, nonce }

        const user: User = await this.userModel.client.create(newUser);

        return { ok: true, data: user, message: 'success' };
    }

    public async getByKey(id: string, publicAddress: string): Promise<MessageLayerDtoT<User>> {
        const user: User = await this.userModel.client.get({ id, publicAddress });
        if (!user) {
            return { ok: false, data: null, message: `User key is not found in database` };
        }
        return { ok: true, data: user, message: `success` };
    }

    public async getByPublicAddress(publicAddress: string): Promise<MessageLayerDtoT<User>> {
        const user: ScanResponse<User> = await this.userModel.client.scan("publicAddress").eq(publicAddress).exec();
        if (!user || user.count <= 0) {
            return { ok: false, data: null, message: `User with publicAddress ${publicAddress} is not found in database` };
        }
        return { ok: true, data: user[0], message: `success` };
    }

    public async updateNonce(u: UserDto) {
        const { id, publicAddress, nonce } = u;
        await this.userModel.client.update({ id, publicAddress }, { nonce });
    }
}

export const UserDaoProvider = { provide: "UserDaoInterface", useClass: UserDao }