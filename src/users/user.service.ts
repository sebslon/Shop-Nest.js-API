import { Injectable } from '@nestjs/common';
import { RegisterUserResponse } from 'src/interfaces/user';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
    const user = new User();
    user.email = newUser.email;

    await user.save();
    return user;
  }

  async getUser(id: string): Promise<User> {
    return User.findOne(id);
  }
}
