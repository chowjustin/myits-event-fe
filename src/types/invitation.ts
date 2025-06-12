export type CreateInvitationRequest = {
  event_id: string;
  user_ids: string[];
};

export interface Invitation {
  id: string;
  event_name: string;
  invited_at: string;
  rsvp_status: "pending" | "accepted" | "declined";
  rsvp_at?: string;
}
