"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Save,
  Users,
  XCircle,
} from "lucide-react";

// API Service with dummy data and logging
const apiService = {
  baseURL: "http://localhost:8080/api",

  log: (method: string, url: string, data?: any, response?: any) => {
    console.group(`🌐 API ${method.toUpperCase()}`);
    console.log(`📍 URL: ${url}`);
    if (data) {
      console.log(`📤 Request:`, data);
    }
    if (response) {
      console.log(`📥 Response:`, response);
    }
    console.groupEnd();
  },

  async getRoomSchedule(roomId: string, date: string, userRole: string) {
    const url = `${this.baseURL}/rooms/${roomId}/schedule?date=${date}&user_role=${userRole}`;

    // Simulate API call
    const mockResponse = {
      status: "success",
      data: {
        room_id: roomId,
        room_name:
          roomId === "room1" ? "A101" : roomId === "room2" ? "A102" : "B201",
        date: date,
        time_slots: Array.from({ length: 15 }, (_, i) => {
          const hour = i + 7;
          let status = "available";

          // Mock some booked and pending slots
          if (hour === 14 || hour === 15) status = "booked";
          if (hour === 16) status = "pending";

          return {
            hour,
            status,
            ...(status === "booked" && {
              event_id: "evt1",
              booked_by: "CS Association",
            }),
            ...(status === "pending" && {
              request_id: "req1",
            }),
          };
        }),
      },
    };

    this.log("GET", url, null, mockResponse);
    return mockResponse;
  },

  async createBookingRequest(data: any) {
    const url = `${this.baseURL}/booking-requests`;
    const mockResponse = {
      status: "success",
      message: "Booking request created successfully",
      data: {
        request_id: `req_${Date.now()}`,
        status: "pending",
      },
    };

    this.log("POST", url, data, mockResponse);
    return mockResponse;
  },

  async getBookingRequests(filters?: any) {
    const url = `${this.baseURL}/booking-requests`;
    const mockResponse = {
      status: "success",
      data: {
        requests: [
          {
            id: "req123",
            event_id: "evt1",
            event_title: "Programming Workshop",
            organization_id: "org1",
            organization_name: "CS Association",
            room_id: "room1",
            date: "2024-03-15",
            time_slots: [16, 17, 18],
            status: "pending",
            created_at: "2024-03-14T10:00:00Z",
          },
          {
            id: "req124",
            event_id: "evt2",
            event_title: "Tech Seminar",
            organization_id: "org2",
            organization_name: "Engineering Club",
            room_id: "room2",
            date: "2024-03-16",
            time_slots: [14, 15],
            status: "pending",
            created_at: "2024-03-14T11:00:00Z",
          },
        ],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 2,
          items_per_page: 20,
        },
      },
    };

    this.log("GET", url, filters, mockResponse);
    return mockResponse;
  },

  async updateBookingRequestStatus(
    requestId: string,
    status: string,
    notes?: string,
  ) {
    const url = `${this.baseURL}/booking-requests/${requestId}/status`;
    const requestData = { status, notes };
    const mockResponse = {
      status: "success",
      message: "Booking request updated successfully",
      data: {
        request_id: requestId,
        status: status,
        reviewed_at: new Date().toISOString(),
      },
    };

    this.log("PUT", url, requestData, mockResponse);
    return mockResponse;
  },

  async getUserEvents(userId: string) {
    const url = `${this.baseURL}/users/${userId}/events`;
    const mockResponse = {
      status: "success",
      data: {
        events: [
          {
            id: "evt1",
            title: "Programming Workshop",
            description: "Workshop on advanced programming concepts",
            created_at: "2024-03-10T09:00:00Z",
          },
          {
            id: "evt2",
            title: "Tech Seminar",
            description: "Latest trends in technology",
            created_at: "2024-03-12T14:00:00Z",
          },
          {
            id: "evt3",
            title: "Student Orientation",
            description: "Welcome new students",
            created_at: "2024-03-13T16:00:00Z",
          },
        ],
      },
    };

    this.log("GET", url, null, mockResponse);
    return mockResponse;
  },

  async getRooms() {
    const url = `${this.baseURL}/rooms`;
    const mockResponse = {
      status: "success",
      data: {
        rooms: [
          {
            id: "room1",
            name: "A101",
            building: "Building A",
            capacity: 30,
            facilities: ["Projector", "Whiteboard"],
          },
          {
            id: "room2",
            name: "A102",
            building: "Building A",
            capacity: 50,
            facilities: ["Projector", "Sound System"],
          },
          {
            id: "room3",
            name: "B201",
            building: "Building B",
            capacity: 40,
            facilities: ["Computer Lab", "Projector"],
          },
        ],
      },
    };

    this.log("GET", url, null, mockResponse);
    return mockResponse;
  },
};

// Mock data and types
interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  facilities: string[];
}

interface TimeSlot {
  hour: number;
  status: "available" | "booked" | "blocked" | "pending";
  eventId?: string;
  eventTitle?: string;
  bookedBy?: string;
  requestId?: string;
}

interface BookingRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  organizationName: string;
  roomId: string;
  date: string;
  timeSlots: number[];
  status: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  role: "student" | "organization" | "department";
  organizationName?: string;
}

const RoomBookingSystem = () => {
  const [currentUser] = useState<User>({
    id: "1",
    name: "John Doe",
    role: "department",
    organizationName: "Computer Science Student Association",
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedRoom, setSelectedRoom] = useState<string>("room1");
  const [view, setView] = useState<"booking" | "management">("booking");
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadRooms();
    if (currentUser.role === "organization") {
      loadUserEvents();
    }
    if (currentUser.role === "department") {
      loadBookingRequests();
    }
  }, []);

  // Load room schedule when date or room changes
  useEffect(() => {
    loadRoomSchedule();
  }, [selectedDate, selectedRoom]);

  const loadRooms = async () => {
    try {
      const response = await apiService.getRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    }
  };

  const loadUserEvents = async () => {
    try {
      const response = await apiService.getUserEvents(currentUser.id);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const loadRoomSchedule = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRoomSchedule(
        selectedRoom,
        selectedDate,
        currentUser.role,
      );
      setTimeSlots(
        response.data.time_slots.map((slot: any) => ({
          hour: slot.hour,
          status: slot.status,
          eventId: slot.event_id,
          eventTitle: slot.event_title,
          bookedBy: slot.booked_by,
          requestId: slot.request_id,
        })),
      );
    } catch (error) {
      console.error("Failed to load room schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookingRequests = async () => {
    try {
      const response = await apiService.getBookingRequests({
        status: "pending",
      });
      // @ts-ignore
      setBookingRequests(response.data.requests);
    } catch (error) {
      console.error("Failed to load booking requests:", error);
    }
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-300 hover:bg-green-200";
      case "booked":
        return "bg-red-100 border-red-300";
      case "blocked":
        return "bg-gray-100 border-gray-300";
      case "pending":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "booked":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleTimeSlotClick = (hour: number, status: string) => {
    if (currentUser.role === "organization" && status === "available") {
      setSelectedTimeSlots((prev) =>
        prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour],
      );
    }
  };

  const handleBookingSubmit = async () => {
    if (selectedTimeSlots.length === 0 || !selectedEventId) {
      alert("Please select time slots and event");
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        event_id: selectedEventId,
        room_id: selectedRoom,
        date: selectedDate,
        time_slots: selectedTimeSlots,
      };

      const response = await apiService.createBookingRequest(bookingData);

      if (response.status === "success") {
        alert("Booking request submitted successfully!");
        setSelectedTimeSlots([]);
        setSelectedEventId("");
        // Reload schedule to show pending status
        await loadRoomSchedule();
      }
    } catch (error) {
      console.error("Failed to create booking request:", error);
      alert("Failed to submit booking request");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "approve" | "reject",
    notes?: string,
  ) => {
    try {
      setLoading(true);
      const response = await apiService.updateBookingRequestStatus(
        requestId,
        action === "approve" ? "approved" : "rejected",
        notes,
      );

      if (response.status === "success") {
        // Update local state
        setBookingRequests((prev) =>
          prev.filter((req) => req.id !== requestId),
        );

        // Reload room schedule to reflect changes
        await loadRoomSchedule();

        alert(`Request ${action}d successfully!`);
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      alert(`Failed to ${action} request`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Room Booking Management
              </h1>
              <p className="text-gray-600">
                Welcome, {currentUser.name} ({currentUser.role})
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView("booking")}
                className={`px-4 py-2 rounded-lg ${view === "booking" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Room Booking
              </button>
              {currentUser.role === "department" && (
                <button
                  onClick={() => setView("management")}
                  className={`px-4 py-2 rounded-lg ${view === "management" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Manage Requests
                </button>
              )}
            </div>
          </div>
        </div>

        {view === "booking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Selection & Date */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Select Room & Date</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - {room.building} (Cap: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {currentUser.role === "organization" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {currentUser.role === "organization" &&
                  selectedTimeSlots.length > 0 && (
                    <button
                      onClick={handleBookingSubmit}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {loading ? "Submitting..." : "Submit Booking Request"}
                    </button>
                  )}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Legend
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Blocked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Timeline */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Time Schedule - {rooms.find((r) => r.id === selectedRoom)?.name}
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.hour}
                    onClick={() => handleTimeSlotClick(slot.hour, slot.status)}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${getSlotColor(slot.status)}
                      ${selectedTimeSlots.includes(slot.hour) ? "ring-2 ring-blue-500" : ""}
                      ${currentUser.role === "organization" && slot.status !== "available" ? "cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {formatHour(slot.hour)}
                      </span>
                      {getStatusIcon(slot.status)}
                    </div>

                    {slot.eventTitle && (
                      <div className="text-xs text-gray-600 truncate">
                        {slot.eventTitle}
                      </div>
                    )}

                    {slot.bookedBy && (
                      <div className="text-xs text-gray-500 truncate">
                        by {slot.bookedBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {currentUser.role === "organization" &&
                selectedTimeSlots.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected time slots:{" "}
                      {selectedTimeSlots.map((h) => formatHour(h)).join(", ")}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {view === "management" && currentUser.role === "department" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Booking Requests Management
            </h2>

            <div className="space-y-4">
              {bookingRequests
                .filter((req) => req.status === "pending")
                ?.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {request.eventTitle}
                          </h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Pending
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>
                              <strong>Organization:</strong>{" "}
                              {request.organizationName}
                            </p>
                            <p>
                              <strong>Room:</strong>{" "}
                              {rooms.find((r) => r.id === request.roomId)?.name}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(request.date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Time:</strong>{" "}
                              {request.timeSlots
                                ?.map((h) => formatHour(h))
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() =>
                            handleRequestAction(request.id, "approve")
                          }
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt("Rejection notes (optional):");
                            handleRequestAction(
                              request.id,
                              "reject",
                              notes || undefined,
                            );
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {bookingRequests.filter((req) => req.status === "pending")
                .length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No pending booking requests</p>
                </div>
              )}
            </div>

            {/* Recent Decisions */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">Recent Decisions</h3>
              <div className="space-y-2">
                {bookingRequests
                  .filter((req) => req.status !== "pending")
                  .slice(0, 5)
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                    >
                      <div className="text-sm">
                        <span className="font-medium">
                          {request.eventTitle}
                        </span>{" "}
                        by {request.organizationName}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </span>
                        {request.notes && (
                          <span
                            className="text-xs text-gray-500"
                            title={request.notes}
                          >
                            <Eye className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingSystem;
