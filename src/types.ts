export interface Ticket {
  _id: string;
  studentName: string;
  className: string;
  problem: string;
  stepsTaken: string;
  status: 'New' | 'In Progress' | 'Complete' | 'Closed' | 'Missed';
  createdAt: string;
  claimedBy: string | null;
  notes: string | null;
}
export interface TicketUpdateEvent {
  ticketId: string;
  status: Ticket['status']; // Re-uses the status type from the Ticket interface
  claimedBy: string;
}