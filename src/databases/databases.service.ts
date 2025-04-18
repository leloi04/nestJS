import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(User.name)
    private UserModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>,

    @InjectModel(Permission.name)
    private PermissionModel: SoftDeleteModel<PermissionDocument>,

    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get('IS_INIT');
    const passwordDefault = this.configService.get('INIT_PASSWORD');
    if (Boolean(isInit)) {
      const countUser = await this.UserModel.find({});
      const countRole = await this.RoleModel.find({});
      const countPermission = await this.PermissionModel.find({});

      if (countPermission.length == 0) {
        await this.PermissionModel.insertMany(INIT_PERMISSIONS);
      }

      const permissionsId = await this.PermissionModel.find().select('_id');
      if (countRole.length == 0) {
        await this.RoleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin thi full quyen',
            isActive: true,
            permissions: permissionsId,
          },
          {
            name: USER_ROLE,
            description: 'Nguoi dung/Ung vien su dung he thong',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      const roleADMIN = await this.RoleModel.findOne({
        name: ADMIN_ROLE,
      }).select('_id');
      const roleUSER = await this.RoleModel.findOne({ name: USER_ROLE }).select(
        '_id',
      );
      if (countUser.length == 0) {
        await this.UserModel.insertMany([
          {
            name: 'Loi',
            email: 'levanloi2004bn@gmail.com',
            password: await this.usersService.getHashPassword(passwordDefault),
            age: 18,
            address: 'viet nam',
            gender: 'male',
            role: roleADMIN?._id,
            company: {
              _id: '67fa3a472b04ceb8a7edaca2',
              name: 'Google',
            },
          },
          {
            name: 'Man Nhi',
            email: 'mannhi2004bn@gmail.com',
            password: await this.usersService.getHashPassword(passwordDefault),
            age: 18,
            address: 'viet nam',
            gender: 'female',
            role: roleUSER?._id,
            company: {
              _id: '67fa3a472b04ceb8a7edaca2',
              name: 'Google',
            },
          },
        ]);
      }

      if (
        countPermission.length > 0 &&
        countRole.length > 0 &&
        countUser.length > 0
      ) {
        this.logger.log('OK');
      }
    }
  }
}
