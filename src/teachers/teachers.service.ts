import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly courseService: CoursesService,
  ) {}

  notFound() {
    throw new NotFoundException(
      `Sorry. I can't find this teacher. Please try again.`,
    );
  }

  public async create(createTeacherDto: CreateTeacherDto) {
    try {
      const { courseId } = createTeacherDto;
      const course = await this.courseService.findOne(courseId);

      if (!course) {
        return this.courseService.notFound();
      }

      const teacher = {
        name: createTeacherDto.name,
        email: createTeacherDto.email,
        course,
      };
      const newTeacher = await this.teacherRepository.save(teacher);
      return newTeacher;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'This email is duplicate. Please try other.',
        );
      }

      throw error;
    }
  }

  public async findAll() {
    const allTeachers = await this.teacherRepository.find();
    if (allTeachers.length === 0) {
      return `There are no teachers. Please register one and then try again.`;
    }
    return allTeachers;
  }

  public async findOne(id: string) {
    const teacher = await this.teacherRepository.findOneBy({
      id,
    });
    if (!teacher) {
      this.notFound();
    }
    return teacher;
  }

  public async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = {
      name: updateTeacherDto?.name,
      email: updateTeacherDto?.email,
    };
    const updatedTeacher = await this.teacherRepository.preload({
      id,
      ...teacher,
    });
    if (!updatedTeacher) {
      return this.notFound();
    }
    return await this.teacherRepository.save(updatedTeacher);
  }

  public async remove(id: string) {
    const teacher = await this.teacherRepository.findOneBy({
      id,
    });
    if (!teacher) {
      return this.notFound();
    }
    return await this.teacherRepository.remove(teacher);
  }
}
