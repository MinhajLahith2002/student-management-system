package com.studentmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;

@Data
public class StudentDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Course is required")
    private String course;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Registration date is required")
    private Date registrationDate;
}
