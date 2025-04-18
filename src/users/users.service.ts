import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModal, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Response } from 'express';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModal.name)
    private UserModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private RoleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(
    {
      password,
      email,
      name,
      age,
      gender,
      address,
      role,
      company,
    }: CreateUserDto,
    user: IUser,
  ) {
    const hashPassword = this.getHashPassword(password);
    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email da ton tai');
    }
    const res = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: res?._id,
      createdAt: res?.createdAt,
    };
  }

  async register(user: RegisterUserDto) {
    const { address, age, email, gender, name, password } = user;
    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email da ton tai');
    }
    const role = await this.RoleModel.findOne({ name: USER_ROLE }).select(
      '_id',
    );
    const hashPassword = this.getHashPassword(password);
    return await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: role?._id,
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.UserModel.find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOneByUsername(username: string) {
    return this.UserModel.findOne({ email: username }).populate({
      path: 'role',
      select: { name: 1 },
    });
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async findOne(id: string) {
    const res = await this.UserModel.findById(id);
    const user = await this.UserModel.findById({ _id: id })
      .populate({ path: 'role', select: { name: 1, _id: 1 } })
      .select('-password');
    return user;
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const newUser = await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return newUser;
  }

  updateRefreshToken = async (refreshToken: string, id: string) => {
    await this.UserModel.updateOne(
      { _id: id },
      {
        refreshToken,
      },
    );
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken }).populate({
      path: 'role',
      select: { name: 1 },
    });
  };

  async remove(id: string, user: IUser) {
    const res = await this.UserModel.findById(id);
    if (res?.name == 'levanloi2004bn@gmail.com') {
      throw new BadRequestException('Day la ADMIN khong the xoa');
    }

    await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.UserModel.softDelete({ _id: id });
  }
}
