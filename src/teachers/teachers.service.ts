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

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  notFound() {
    throw new NotFoundException(
      `Sorry. I can't find this teacher. Please try again.`,
    );
  }

  async create(createTeacherDto: CreateTeacherDto) {
    try {
      const teacher = {
        name: createTeacherDto.name,
        email: createTeacherDto.email,
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

  async findAll() {
    const allTeachers = await this.teacherRepository.find();
    if (allTeachers.length === 0) {
      return `There are no teachers. Please register one and then try again.`;
    }
    return allTeachers;
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepository.findOneBy({
      id,
    });
    if (!teacher) {
      this.notFound();
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
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

  async remove(id: string) {
    const teacher = await this.teacherRepository.findOneBy({
      id,
    });
    if (!teacher) {
      return this.notFound();
    }
    return await this.teacherRepository.remove(teacher);
  }
}
