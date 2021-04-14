import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserResponse } from '../interfaces/user';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('/registeruser')
  registerUser(@Body() newUser: RegisterDto): Promise<RegisterUserResponse> {
    return this.userService.register(newUser);
  }
}
