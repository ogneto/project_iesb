import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(5)
  phone_number: string;

  @IsUUID()
  courseId: string;
}
