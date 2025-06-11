export type Department = {
  id: string;
  name: string;
  email: string;
  faculty: string;
};

export type CreateDepartmentRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
  faculty: string;
};

export type UpdateDepartmentRequest = {
  name?: string;
  email?: string;
  password?: string;
  faculty?: string;
};
