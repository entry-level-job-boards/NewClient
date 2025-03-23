export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  benefits: string[];
  deadline: string;
  salary: string;
  isRemote: boolean;
}

export interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume?: File;
}