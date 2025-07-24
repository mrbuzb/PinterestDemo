export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

export interface UserCreateDto extends User {
  password: string;
}

export interface UserLoginDto {
  userName: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expires: number;
  };
}

export interface SendCodeRequest {
  email: string;
}

export interface ConfirmCodeRequest {
  code: string;
  email: string;
}

export interface RefreshRequestDto {
  accessToken: string;
  refreshToken: string;
}