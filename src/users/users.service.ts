import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    const newUserEntity = this.usersRepository.create(userToCreate);

    try {
      return await this.usersRepository.save(newUserEntity);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('此信箱已被註冊過');
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user') // 建立一個查詢建構器，'user' 是別名
      .where('user.email = :email', { email }) // 設定查詢條件
      .addSelect('user.password') // 關鍵！強制選擇 password 欄位
      .getOne(); // 取得一筆資料
  }

  // ... findAll, findOne, update, remove 等方法暫時保持不變 ...
  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    // 之後我們會需要一個更完整的 findOne
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
