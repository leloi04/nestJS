import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsEmail({}, { message: 'email khong dung dinh dang' })
  @IsNotEmpty({ message: 'email khong duoc de trong' })
  email: string;

  @IsArray({ message: 'skills co dinh dang la array' })
  @IsNotEmpty({ message: 'skills khong duoc de trong' })
  @IsString({
    each: true,
    message: 'moi phan tu trong skills deu la dang chuoi',
  })
  skills: string[];
}
