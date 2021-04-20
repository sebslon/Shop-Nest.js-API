import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { RegisterUserResponse } from '../interfaces/user';
import { User } from './entities/user.entity';
import { hashPassword } from '../utils/hash-password';
import { Console, Command } from 'nestjs-console';

@Injectable()
@Console({
  name: 'users',
})
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

  async getUser(id: string): Promise<User> {
    return User.findOne(id);
  }

  //Console commands
  @Command({
    command: 'list',
    description: 'list all users',
  })
  async listUsersCmd() {
    console.log((await User.find()).map(this.filter));
  }

  @Command({
    command: 'add <email> <pwd>',
    description: 'Add new user',
  })
  async addUsersCmd(email: string, pwd: string) {
    console.log(
      await this.register({
        email,
        pwd,
      }),
    );
  }
}
