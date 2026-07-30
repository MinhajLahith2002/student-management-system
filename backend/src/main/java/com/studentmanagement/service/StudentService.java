package com.studentmanagement.service;

import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.model.Student;

import java.util.List;

public interface StudentService {
    Student createStudent(StudentDTO studentDTO);
    List<Student> getAllStudents();
    Student getStudentById(String id);
    Student updateStudent(String id, StudentDTO studentDTO);
    void deleteStudent(String id);
    List<Student> searchStudents(String query);
}
