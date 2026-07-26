# Sales Kiosk App

A full-stack real estate sales kiosk application built to manage property inventory, booking requests, gallery images, and video walkthroughs. The project includes a React-based frontend for interactive kiosk screens and a Spring Boot backend with MongoDB persistence and real-time WebSocket synchronization.

## Project Overview

This application is designed for sales and property showcase use cases where a controller can manage listings and other users can view synchronized updates in real time. It combines:

- A modern frontend for browsing inventory, images, and videos
- A backend API for CRUD operations and business logic
- Real-time synchronization between screens using WebSockets
- MongoDB storage for persistent data

---

## Main Features

### Frontend Features
- Inventory management with towers, floors, and units
- Booking flow with unit reservation and booking modal
- Gallery page for property images
- Video walkthrough page for promotional videos
- Search and filter support for inventory, gallery, and videos
- Role-based interaction for controller and display users
- Material UI-based responsive interface
- WebSocket-driven live updates across connected clients
- Mortgage calculator widget for quick property pricing insight

### Backend Features
- REST API for inventory operations
- Booking management endpoints
- Gallery and video media management endpoints
- WebSocket broadcast support for real-time synchronization
- MongoDB-based data persistence
- Exception handling for not-found and booking conflicts
- Initial data seeding support

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- Material UI (MUI)
- Axios
- SockJS + STOMP for WebSocket communication
- ESLint for linting

### Backend
- Java 17
- Spring Boot
- Spring Web MVC
- Spring WebSocket
- Spring Data MongoDB
- Lombok
- Maven

---

## Project Structure

```text
sales-kiosk-app/
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── Backend/
│   └── kiosk/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   └── resources
│       │   └── test
│       ├── pom.xml
│       ├── mvnw
│       ├── mvnw.cmd
│       └── Dockerfile
└── README.md
```

---

## Frontend Overview

The frontend is a React + Vite application that provides the kiosk user experience. It allows users to browse property inventory, add or edit listings, manage gallery images, watch walkthrough videos, and view synchronized updates from the backend in real time.

### Frontend Main Pages
- Inventory Page
  - Displays towers and unit cards
  - Supports search and filtering
  - Shows booking and availability status
- Gallery Page
  - Displays media gallery cards
  - Supports add, edit, and delete actions for controller users
- Videos Page
  - Displays walkthrough videos
  - Supports search and CRUD operations

### Frontend Installation

```bash
cd Frontend
npm install
```

### Frontend Run

```bash
cd Frontend
npm run dev
```

The application will run locally on:
- http://localhost:5173

### Frontend Build

```bash
cd Frontend
npm run build
```

---

## Backend Overview

The backend is a Spring Boot application that exposes REST APIs for managing inventory, bookings, gallery items, and videos. It also pushes live update events through WebSockets so connected frontend clients stay in sync.

### Backend Main Modules
- Controllers
  - BookingController
  - InventoryController
  - MediaController
  - SyncWebSocketController
- Services
  - BookingService
  - InventoryService
- Models
  - Booking
  - Tower
  - Unit
  - MediaItem
  - SyncMessage
- Repositories
  - MongoDB-backed repositories for data access

### Backend Installation

Make sure Java 17 and MongoDB are available.

### Backend Environment Variables

Set the following environment variable before running the backend:

```bash
MONGO_URI=mongodb://localhost:27017/kiosk_db
PORT=8080
```

### Backend Run

On Windows:

```bash
cd Backend/kiosk
mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
cd Backend/kiosk
./mvnw spring-boot:run
```

The backend will run on:
- http://localhost:8080

### Backend Build

```bash
cd Backend/kiosk
./mvnw clean package
```

---

## API Summary

### Inventory Endpoints
- GET /api/inventory
- GET /api/inventory/tower/{id}
- POST /api/inventory/tower
- PUT /api/inventory/tower/{id}
- PATCH /api/inventory/tower/{id}
- DELETE /api/inventory/tower/{id}

### Booking Endpoints
- GET /api/bookings
- GET /api/bookings/{id}
- POST /api/book
- PUT /api/bookings/{id}
- PATCH /api/bookings/{id}
- DELETE /api/bookings/{id}

### Media Endpoints
- GET /api/gallery
- POST /api/gallery
- PUT /api/gallery/{id}
- DELETE /api/gallery/{id}
- GET /api/videos
- POST /api/videos
- PUT /api/videos/{id}
- DELETE /api/videos/{id}

### WebSocket
- Topic: /topic/sync
- Used for real-time inventory, gallery, video, and booking synchronization

---

## Database

The backend uses MongoDB for storing:
- Tower and unit inventory data
- Bookings
- Gallery items
- Video items

A MongoDB connection string is required through the MONGO_URI environment variable.

---

## Docker Support

A Dockerfile is available in the backend project for container-based setup.

Example:

```bash
cd Backend/kiosk
docker build -t kiosk-backend .
docker run -p 8080:8080 -e MONGO_URI=mongodb://host.docker.internal:27017/kiosk_db kiosk-backend
```

---

## Development Notes

- The frontend and backend should be started separately.
- Real-time updates require the backend WebSocket service and the frontend WebSocket connection to be active.
- The application uses role-based behavior so controller actions such as add, edit, and delete are available for authorized control users.

---

## Summary

This project brings together a polished kiosk experience and a robust backend service for property sales operations. It is suitable for:
- Real estate showroom displays
- Property inventory management
- Sales presentation and booking workflows
- Live synchronized content across connected screens

*Last Updated:* July 26, 2026  
*Version:* 1.0.0  
*Maintainer:* Ankit Maurya

*Built with Ankit Maurya ❤️ using React.js + Vite and Material UI*