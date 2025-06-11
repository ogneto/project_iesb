import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  notFound() {
    throw new NotFoundException(
      `Sorry. I can't find this student. Please try again.`,
    );
  }

  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  }

  async findAll() {
    const all = await this.courseRepository.find();
    if (all.length === 0) {
      return `There are no courses. Please register one and then try again.`;
    }
    return all;
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOneBy({
      id,
    });
    if (!course) {
      return this.notFound();
    }
    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
