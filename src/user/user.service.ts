import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { RegisterUserResponse } from '../interfaces/user';
import { User } from './entities/user.entity';
import { hashPassword } from '../utils/hash-password';

@Injectable()
export class UserService {
  filter(user: User): RegisterUserResponse {
    const { id, email } = user;
    return { id, email };
  }

  async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
    const user = new User();
    user.email = newUser.email;
    user.pwdHash = await hashPassword(newUser.pwd);

    await user.save();

    return this.filter(user);
  }

  async getOneUser(id: string): Promise<User> {
    return await User.findOne(id);
  }

  async listUsersCmd() {
    console.log((await User.find()).map(this.filter));
  }
}
