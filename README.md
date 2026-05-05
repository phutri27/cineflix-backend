# Cineflix - Full-Stack Cinema Booking Platform

A high-performance, real-time cinema ticketing system built to handle concurrent seat bookings, background scheduling, and seamless payment processing. 

## Live Demo
* **Live Site:** [https://hotriphu.fit](https://hotriphu.fit)

## Key Features
* **Secure Authentication:** Seamless user onboarding using Google OAuth2 integrated with secure session-based login.
* **Real-Time Seat Locking:** Implemented concurrency control using WebSockets (Socket.io) and Redis Locks. This instantly reserves seats across all active clients the moment a user enters checkout, completely eliminating double-booking conflicts.
* **Payment Integrations:** Integrated secure, automated checkouts via Stripe and VNPay, utilizing strict webhook verification to ensure payment integrity.
* **Background Processing:** Offloaded heavy, blocking tasks to isolated background workers using BullMQ and Redis. This includes automated cron jobs for showtime generation, as well as reliable delivery of OTPs and transactional ticket-confirmation emails.
* **Instant Notifications:** Pushes real-time booking confirmations to the client upon successful payment webhook verification.
* **Admin Dashboard:** A full-featured internal portal for staff to manage movie catalogs, cinema rooms, dynamic showtime schedules,user role permissions and statistics.

## Tech Stack
**Frontend:**
* React (TypeScript)
* TanStack Query (React Query) for caching and server-state management
* Tailwind CSS / UI Components
* React-Hook-Form
* React-Router

**Backend:**
* Node.js / Express
* Prisma ORM
* PostgreSQL
* Redis (for Express sessions, BullMQ, and fast state caching)
* BullMQ (Cron jobs and background workers)
* Socket.io
* Resend
* Cloudinary

**Infrastructure**
* Hosted on DigitalOcean (Ubuntu VPS)
* Separate processes for API and Background Worker
* Nginx Reverse Proxy

## Architecture Overview

### Backend
The backend is split into 3 primary processes to ensure high availability:
1. **Core Express API Server:** Handles incoming HTTP requests, WebSocket connections, session management, and payment webhooks.
2. **Showtime Scheduling Worker (BullMQ):** An isolated background process dedicated to listening to Redis queues. It safely executes heavy database writes (like upserting weekly showtimes) asynchronously, ensuring the main API thread remains lightning-fast.
3. **Transactional Email And Cloudinary Upload Worker (BullMQ)** A dedicated background processor that handles all asynchronous email delivery (e.g., OTPs and ticket confirmations) and Cloudinary media uploads. Offloading third-party network calls ensures instant checkout response times for the user.

### Frontend
The frontend is built as a highly responsive Single Page Application (SPA) designed to handle complex state and real-time updates seamlessly:
1. **Server-State & Caching Layer:** (TanStack Query): Serves as the backbone for async data management. It caches the notifications, booking history, profile information, minimizing redundant API calls and enabling a snappy user experience through background refetching and optimistic UI updates.

2. **Real-Time Synchronization (Socket.io Client):** Maintains a persistent, lightweight WebSocket connection with the core API. This layer listens for instant seat-lock broadcasts and payment confirmations, dynamically updating the interactive seat-selection grid across all active browsers without requiring page refreshes.

3. **Component & Styling Architecture (Tailwind CSS):** Utilizes a utility-first styling approach combined with modular UI components to maintain a consistent design system. This ensures rapid iteration and a fully responsive layout across desktop and mobile devices.