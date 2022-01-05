import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { User } from "src/models/user.model";
import { AddUserDto } from "../dto/add-user.dto";
import { UserDto } from "../dto/user.dto";

export interface IUserDao {
    createUser(u: AddUserDto): Promise<MessageLayerDtoT<User>>;
    getByKey(id: string, publicAddress: string): Promise<MessageLayerDtoT<User>>;
    getByPublicAddress(publicAddress: string): Promise<MessageLayerDtoT<User>>;
    updateNonce(u: UserDto): Promise<void>;
}