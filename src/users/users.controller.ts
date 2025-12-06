import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { ApiresponseDto } from '../common/dto/api-response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

ApiTags('使用者管理');
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '建立使用者' })
  @ApiOkResponse({
    description: '使用者建立成功',
    type: CreateUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      status: true,
      message: '使用者建立成功',
      data: newUser,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // 3. 使用 AuthGuard 來保護這個路由
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '取得所有使用者 (需要身份驗證)' })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      status: true,
      message: '使用者列表取得成功',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // 3. 使用 AuthGuard 來保護這個路由
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return {
      status: true,
      message: '使用者資料取得成功',
      data: user,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return {
      status: true,
      message: '使用者資料更新成功',
      data: updatedUser,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      status: true,
      message: '使用者刪除成功',
      data: null,
    };
  }
}
