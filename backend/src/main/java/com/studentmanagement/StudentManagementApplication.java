package com.studentmanagement;

import com.studentmanagement.model.User;
import com.studentmanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class StudentManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentManagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(UserRepository userRepository, PasswordEncoder passwordEncoder, com.studentmanagement.repository.StudentRepository studentRepository, com.studentmanagement.service.StudentService studentService) {
		return args -> {
			if (userRepository.findByEmail("admin@example.com").isEmpty()) {
				User admin = User.builder()
						.email("admin@example.com")
						.password(passwordEncoder.encode("admin123"))
						.role("ROLE_ADMIN")
						.build();
				userRepository.save(admin);
			}

            // Remove old students
            studentRepository.deleteAll();

            // Add new test students
            String[] names = {"Minhaj Lahith", "Jane Doe", "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Eve Adams", "Frank Castle", "Grace Hopper", "Hank Pym"};
            String[] courses = {"Data Science", "Software Engineering", "Information Technology", "Computer Science", "Business Administration", "Data Science", "Software Engineering", "Information Technology", "Computer Science", "Business Administration"};
            String[] genders = {"Male", "Female", "Female", "Male", "Male", "Female", "Female", "Male", "Female", "Male"};
            
            for (int i = 0; i < 10; i++) {
                com.studentmanagement.dto.StudentDTO s = new com.studentmanagement.dto.StudentDTO();
                s.setFullName(names[i]);
                s.setEmail(names[i].toLowerCase().replace(" ", ".") + "@example.com");
                s.setPhoneNumber(String.format("07%d12345%02d", (i % 8) + 1, i)); // Generate valid Sri Lankan phone number starting with 0
                s.setCourse(courses[i]);
                s.setAge(18 + (i % 5));
                s.setGender(genders[i]);
                s.setAddress("City " + (i + 1));
                s.setRegistrationDate(new java.util.Date());
                studentService.createStudent(s);
            }
		};
	}
}
