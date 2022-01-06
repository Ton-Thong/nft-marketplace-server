import { AddUserDto } from "../dto/add-user.dto";
import { UserDto } from "../dto/user.dto";

export interface IUserService {
    createUser(u: AddUserDto): Promise<UserDto>;
    getByKey(id: string, publicAddress: string): Promise<UserDto>;
    getByPublicAddress(publicAddress: string): Promise<UserDto>;
    updateNonce(u: UserDto): Promise<void>;
    getUserAll();
}