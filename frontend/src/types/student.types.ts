export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  course: string;
  age: number;
  gender: string;
  address: string;
  registrationDate: string;
}

export interface StudentFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  course: string;
  age: number;
  gender: string;
  address: string;
  registrationDate?: string;
}
