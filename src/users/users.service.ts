import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { UserCreateRequestDto } from './dto/user-create-request.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(createUserDto: UserCreateRequestDto): Promise<void> {
    const { name, email, password } = createUserDto;

    await this.userModel
      .create({
        name,
        email,
        password,
      })
      .catch((error) => console.log(error));
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.userModel.destroy({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.userModel.update(data, {
      where: {
        id,
      },
    });
  }
}
