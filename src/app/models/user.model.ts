export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  birthday: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  username: string;
  fullName: string;
  birthday: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}
