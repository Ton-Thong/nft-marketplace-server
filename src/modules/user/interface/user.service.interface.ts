import { AddUserDto } from "../dto/add-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserDto } from "../dto/user.dto";

export interface IUserService {
    createUser(u: AddUserDto): Promise<UserDto>;
    getByKey(id: string): Promise<UserDto>;
    getByPublicAddress(publicAddress: string): Promise<UserDto>;
    updateNonce(u: UserDto): Promise<void>;
    updateUserProfile(u: UpdateUserDto, file: Express.Multer.File, id: string): Promise<void>;
    getUserAll();
}