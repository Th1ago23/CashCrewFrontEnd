export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  birthDay: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  emailAddress: string;
  password: string;
  username: string;
  fullname: string;
  birthDay: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
}

// Corresponde ao UserSummaryDTO do backend
export interface UserSummary {
  id: number;        // ✅ Agora o backend retorna o ID
  name: string;
}
