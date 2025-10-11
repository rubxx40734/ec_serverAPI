import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// 1. 先使用 OmitType 建立一個 "基礎更新模型"，它排除了 password 和 email 欄位。
//    'as const' 是 TypeScript 的一個技巧，可以讓類型推斷更精確。
const UpdateUserModel = OmitType(CreateUserDto, ['password', 'email'] as const);

// 2. 再使用 PartialType 讓這個基礎模型的所有屬性都變成可選的。
export class UpdateUserDto extends PartialType(UpdateUserModel) {}
