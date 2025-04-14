import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({message: "_id khong duoc de trong"})
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: "_name khong duoc de trong"})
    name: string;
}

export class UpdateJobDto {
    @IsNotEmpty({message: "name khong duoc de trong"})
    name: string;
    
    @IsString({each: true, message: "skills phai la kieu string"})
    @IsNotEmpty({message: "skills khong duoc de trong"})
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({message: "salary khong duoc de trong"})
    salary: number;

    @IsNotEmpty({message: "quantity khong duoc de trong"})
    quantity: number;

    @IsNotEmpty({message: "level khong duoc de trong"})
    level: string;

    @IsNotEmpty({message: "description khong duoc de trong"})
    description: string;

    // @IsDate({message: "startDate khong dung dinh dang"})
    @IsNotEmpty({message: "startDate khong duoc de trong"})
    startDate: Date;

    // @IsDate({message: "endDate khong dung dinh dang"})
    @IsNotEmpty({message: "endDate khong duoc de trong"})
    endDate: Date;

    @IsBoolean({message: "isActive khong dung dinh dang"})
    @IsNotEmpty({message: "isActive khong duoc de trong"})
    isActive: boolean
}
