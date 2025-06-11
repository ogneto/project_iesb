import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly courseService: CoursesService,
  ) {}

  notFound() {
    throw new NotFoundException(
      `Sorry. I can't find this student. Please try again.`,
    );
  }

  public async create(createStudentDto: CreateStudentDto) {
    try {
      const { courseId } = createStudentDto;
      const course = await this.courseService.findOne(courseId);
      if (!course) {
        return this.courseService.notFound();
      }

      const student = {
        name: createStudentDto.name,
        email: createStudentDto.email,
        phone_number: createStudentDto.phone_number,
        course,
      };
      const newStudent = await this.studentRepository.save(student);
      return student;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `This email is duplicate. Please try other.`,
        );
      }

      throw error;
    }
  }

  public async findAll() {
    const allStudents = await this.studentRepository.find();
    if (allStudents.length === 0) {
      return `There are no students. Please register one and then try again.`;
    }
    return allStudents;
  }

  public async findOne(id: string) {
    const student = await this.studentRepository.findOneBy({
      id,
    });
    if (!student) {
      return this.notFound();
    }
    return student;
  }

  public async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = {
      name: updateStudentDto?.name,
      email: updateStudentDto?.email,
      phone_number: updateStudentDto?.phone_number,
    };
    const updatedStudent = await this.studentRepository.preload({
      id,
      ...student,
    });

    if (!updatedStudent) {
      return this.notFound();
    }

    return await this.studentRepository.save(updatedStudent);
  }

  public async remove(id: string) {
    const student = await this.studentRepository.findOneBy({
      id,
    });
    if (!student) {
      return this.notFound();
    }
    return await this.studentRepository.remove(student);
  }
}
