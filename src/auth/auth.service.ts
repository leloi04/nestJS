import { response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hashSync } from 'bcryptjs';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import ms from "ms"
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if(user) {
            const isValid = this.usersService.isValidPassword(password, user?.password!)
            if(isValid === true) {
                return user
            }
        }
        
        return null;
      }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        await this.usersService.updateRefreshToken(refresh_token, _id)

        response.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<number>("JWT_REFRESH_EXPIRES")!) as any
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
         };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    logout = async (user: IUser, response: Response ) => {
        await this.usersService.updateRefreshToken("", user._id)
        response.clearCookie("refresh_token")
        return "ok"
    }

    createRefreshToken = (payload) => {
       const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES")
       })
       return refresh_token
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
           
            let user = await this.usersService.findUserByRefreshToken(refreshToken);

            if(user) {
                console.log(user)
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "refresh token",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                const refresh_token = this.createRefreshToken(payload)

                await this.usersService.updateRefreshToken(refresh_token, _id.toString())

                response.clearCookie("refresh_token")

                response.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<number>("JWT_REFRESH_EXPIRES")!) as any
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
         };

            } else {
                throw new BadRequestException("Refresh token loi")
            }
        } catch (error) {
            throw new BadRequestException("Refresh token loi")
        }
    }
}
