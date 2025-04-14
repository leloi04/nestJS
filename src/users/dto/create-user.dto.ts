import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsEmail({}, { message: 'email khong dung dinh dang' })
  @IsNotEmpty({ message: 'email khong duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'password khong duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'age khong duoc de trong' })
  age: number;

  @IsNotEmpty({ message: 'gender khong duoc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'address khong duoc de trong' })
  address: string;

  @IsNotEmpty({ message: 'role khong duoc de trong' })
  @IsMongoId({ message: 'role phai co dinh dang la id' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @IsNotEmpty({ message: 'company khong duoc de trong' })
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsEmail({}, { message: 'email khong dung dinh dang' })
  @IsNotEmpty({ message: 'email khong duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'password khong duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'age khong duoc de trong' })
  age: number;

  @IsNotEmpty({ message: 'gender khong duoc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'address khong duoc de trong' })
  address: string;

  role: mongoose.Schema.Types.ObjectId;
}
