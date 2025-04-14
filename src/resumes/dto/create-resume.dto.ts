import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'url khong duoc de trong' })
  url: string;

  @IsNotEmpty({ message: 'companyId khong duoc de trong' })
  @IsMongoId({ message: 'companyId khong dung dinh dang' })
  companyId: string;

  @IsNotEmpty({ message: 'jobId khong duoc de trong' })
  @IsMongoId({ message: 'jobId khong dung dinh dang' })
  jobId: string;
}
