export interface JWTPayload {
  id: number;
  Email: string;
}

export interface RouteProps {
  params: { id: string };
}

export interface RegisterFormType {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
  ConfirmPassword?: string;
  Image?: File;
}

export interface LoginFormType {
  Email?: string;
  Password?: string;
}
