import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
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
    // 計算目前使用者數量
    const userCount = await this.usersRepository.count();

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
      role: userCount === 0 ? UserRole.ADMIN : UserRole.USER, // 如果是第一個使用者，設為 ADMIN
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

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的使用者`);
    }
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    // 2. 將 DTO 中的資料（只有 name）合併到從資料庫撈出來的 user 物件上
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    // 2. .remove() 會回傳一個 Promise<void>
    await this.usersRepository.remove(user);
  }
}
