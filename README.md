# myITS Event Frontend

This is the frontend repository for **myITS Event**, an all-in-one platform designed to streamline event management and room bookings within the ITS ecosystem. The application provides a seamless experience for users, event organizers (Ormawa), departments, and administrators to manage events, invitations, room reservations, and attendance tracking.

Built with Next.js and TypeScript, the platform features a role-based access control system to cater to the specific needs of each user type.

## Key Features

The application supports four distinct user roles, each with a specific set of permissions and features:

### 1. User (Mahasiswa)
Standard users have access to essential features for event participation.
- **Profile Management**: Users can view and update their personal information and change their password.
- **View Invitations**: Access a personal dashboard to see all received event invitations.
- **RSVP Management**: Accept or decline event invitations. The status is updated in real-time.
- **Invitation Details**: View detailed information for each invitation, including event details and RSVP status.

### 2. Ormawa (Organisasi/Event Organizer)
In addition to all User features, Organizers have a full suite of tools for event management.
- **Event Management**: Create, view, update, and delete events.
- **Invitation Management**: Send event invitations to registered users.
- **Track Invitees**: Monitor the RSVP status (Pending, Accepted, Declined) for all invited users for a specific event.
- **Room Booking**: Request room bookings for their events.
- **Real-time Attendance**: Utilize a QR code scanner to efficiently manage and record event attendance (presensi).

### 3. Departemen (Department)
Departments have access to all User features, plus specialized tools for managing their facilities.
- **Room Management**: Add, view, update, and delete rooms available for booking within the department.
- **Booking Request Management**: Review, approve, or reject room booking requests submitted by Organizers.

### 4. Admin
Admins have superuser privileges with access to all features across all roles, in addition to site-wide administrative capabilities.
- **Full System Access**: Access to all features available to Users, Ormawa, and Departments.
- **Department & Organization Management**: Create, view, update, and delete Department and Ormawa accounts.
- **Global Attendee View**: View a consolidated list of all attendees across all events in the system.

