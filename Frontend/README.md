# EventNest – Frontend

EventNest Frontend is the user-facing application for the EventNest college event management system. It provides students and administrators with a clean, responsive interface to create events, register participants, perform QR-based check-ins, and monitor event activity in real time.

The frontend prioritizes usability, clarity, and operational reliability during high-traffic college events.

---

## Product Philosophy

College events often fail at scale due to poor coordination and slow verification processes.  
The frontend is designed to minimize friction for students while giving administrators **real-time visibility and control** during live events.

UI decisions emphasize speed, accuracy, and transparency over visual complexity.

---

## Engineering Focus

- Component-driven architecture using React
- Role-aware UI rendering (Student vs Admin)
- Secure integration with backend REST APIs
- Real-time data visualization for operational monitoring
- Performance-conscious rendering for large participant datasets

---

## Tech Stack

- **Framework:** React.js
- **Charts & Visualization:** Chart.js
- **QR Code Handling:** qrcode.react
- **Styling:** CSS
- **API Communication:** REST APIs
- **Deployment:** Vercel

---

## Key Features

- Student and Admin dashboards with role-based views
- Event browsing, registration, and status tracking
- QR code generation for registered participants
- Real-time participant count and check-in analytics
- Responsive UI optimized for event-day usage

---

## Architecture Overview

- React components consume backend REST APIs
- Authentication state drives role-based rendering
- QR codes are generated client-side and validated server-side
- Chart.js powers real-time visual insights for administrators

---

## Setup Instructions

1. Clone the repository
2. Install dependencies: npm install
3. Configure environment variables
4. Start the development server:
5. npm start
6. Ensure the backend service is running
