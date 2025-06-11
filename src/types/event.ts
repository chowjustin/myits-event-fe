export type Event = {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  created_by: string;
  event_type: "online" | "offline";
};

export type CreateEventRequest = {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  event_type: "online" | "offline";
};

export type UpdateEventRequest = {
  name?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  event_type?: "online" | "offline";
};
