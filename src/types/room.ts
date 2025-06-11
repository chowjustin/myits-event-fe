export type Room = {
  id: string;
  name: string;
  department: string;
  department_id: string;
  capacity: number;
};

export type CreateRoomRequest = {
  name: string;
  capacity: number;
};

export type UpdateRoomRequest = {
  name?: string;
  capacity?: number;
  department_id: string;
};
