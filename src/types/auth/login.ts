export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  role: string;
};

export type LoginError = {
  error: string;
};
