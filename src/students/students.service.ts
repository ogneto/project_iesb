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

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  notFound() {
    throw new NotFoundException(
      `Sorry. I can't find this student. Please try again.`,
    );
  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = {
        name: createStudentDto.name,
        email: createStudentDto.email,
        phone_number: createStudentDto.phone_number,
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

  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOneBy({
      id,
    });
    if (!student) {
      return this.notFound();
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
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

  async remove(id: string) {
    const student = await this.studentRepository.findOneBy({
      id,
    });
    if (!student) {
      return this.notFound();
    }
    return await this.studentRepository.remove(student);
  }
}
