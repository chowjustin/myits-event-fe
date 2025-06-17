export type CreateBookingRequest = {
  event_id: string;
  room_ids: string[];
};

interface Room {
  room_id: string;
  room_name: string;
}

export type BookingRequest = {
  booking_id: string;
  booking_status: "pending" | "approved" | "rejected";
  event_id: string;
  event_name: string;
  requested_by: string;
  rooms: Room[];
};

export type BookingRequestWithCapacity = {
  booking_request_id: string;
  status: "pending" | "approved" | "rejected";
  event_name: string;
  room_name: string;
  room_capacity: number;
  requested_at: string;
};
