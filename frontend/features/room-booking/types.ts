export interface RoomAvailability {
  roomId: string;
  name: string;
  capacity: number;
  floor: string;
  hasWhiteboard: boolean;
  hasVideoConf: boolean;
  bookedSlots: string[];
}

export interface RoomBookingResponse {
  id: string;
  roomId: string;
  roomName: string;
  employeeId: string;
  date: string;
  timeSlot: string;
  status: string;
}

export interface CreateRoomBookingRequest {
  roomId: string;
  employeeId: string;
  date: string;
  timeSlot: string;
}
