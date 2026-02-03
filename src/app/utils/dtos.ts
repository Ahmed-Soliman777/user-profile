export interface CreateUserDTO {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Image: string;
}

export interface LoginUserDTO {
  Email: string;
  Password: string;
}

export interface UpdateUserDTO {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
  Image?: string;
}
