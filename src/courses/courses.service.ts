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
      `Sorry. I can't find this course. Please try again.`,
    );
  }

  async create(createCourseDto: CreateCourseDto) {
    const course = {
      course_name: createCourseDto.course_name,
      description: createCourseDto.description,
    };
    return await this.courseRepository.save(course);
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

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse = {
      course_name: updateCourseDto?.course_name,
      description: updateCourseDto?.description,
    };
    const course = await this.courseRepository.preload({
      id,
      ...updatedCourse,
    });
    if (!course) {
      return this.notFound();
    }
    return await this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOneBy({
      id,
    });
    if (!course) {
      return this.notFound();
    }
    return await this.courseRepository.remove(course);
  }
}
