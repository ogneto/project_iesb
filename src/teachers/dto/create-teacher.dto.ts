import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsUUID()
  courseId: string;
}
