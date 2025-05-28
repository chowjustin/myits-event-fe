export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type WithToken = {
  token: string;
};
