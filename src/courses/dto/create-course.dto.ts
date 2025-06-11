import { IsString, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MaxLength(50)
  course_name: string;

  @IsString()
  @MaxLength(200)
  description: string;
}
