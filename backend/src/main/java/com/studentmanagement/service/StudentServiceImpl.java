package com.studentmanagement.service;

import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.model.Student;
import com.studentmanagement.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    private String generateCoursePrefix(String courseName) {
        if (courseName == null || courseName.trim().isEmpty()) {
            return "STU";
        }
        String[] words = courseName.trim().split("\\s+");
        StringBuilder prefix = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                prefix.append(word.toUpperCase().charAt(0));
            }
        }
        return prefix.toString();
    }

    @Override
    public Student createStudent(StudentDTO studentDTO) {
        String prefix = generateCoursePrefix(studentDTO.getCourse());
        Student student = Student.builder()
                .studentId(prefix + "-" + java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .fullName(studentDTO.getFullName())
                .email(studentDTO.getEmail())
                .phoneNumber(studentDTO.getPhoneNumber())
                .course(studentDTO.getCourse())
                .age(studentDTO.getAge())
                .gender(studentDTO.getGender())
                .address(studentDTO.getAddress())
                .registrationDate(studentDTO.getRegistrationDate() != null ? studentDTO.getRegistrationDate() : new Date())
                .build();
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public Student updateStudent(String id, StudentDTO studentDTO) {
        Student existingStudent = getStudentById(id);
        
        existingStudent.setFullName(studentDTO.getFullName());
        existingStudent.setEmail(studentDTO.getEmail());
        existingStudent.setPhoneNumber(studentDTO.getPhoneNumber());
        existingStudent.setCourse(studentDTO.getCourse());
        existingStudent.setAge(studentDTO.getAge());
        existingStudent.setGender(studentDTO.getGender());
        existingStudent.setAddress(studentDTO.getAddress());
        
        if (studentDTO.getRegistrationDate() != null) {
            existingStudent.setRegistrationDate(studentDTO.getRegistrationDate());
        }

        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(String id) {
        Student existingStudent = getStudentById(id);
        studentRepository.delete(existingStudent);
    }

    @Override
    public List<Student> searchStudents(String query) {
        return studentRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }
}
