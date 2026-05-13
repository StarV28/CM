# Cryptocurrency Monitoring Platform (TradMon)

A production-grade cryptocurrency monitoring platform built and maintained as an independent product.

The system is designed to provide real-time market data, authentication, and user-facing analytics with a scalable multi-service backend architecture.

---

##  Overview

TradMon is a real-time cryptocurrency monitoring platform built as a working product.

It aggregates external market data, processes it through backend services, and delivers real-time updates to users via WebSockets.

The system was designed with scalability, performance, and modular backend architecture in mind, and is actively used as a deployed application.

---

##  Architecture

The platform is built using a distributed backend approach:

### Frontend
- Nuxt.js application (SSR via Nitro)
- Multi-language support (i18n, 5 locales)
- IP/location-based logic handling
- Real-time UI updates via WebSockets

### Backend Services
- Express API service for external data ingestion and processing
- Express service for frontend data delivery
- JWT authentication system
- Google OAuth2 authentication & registration
- WebSocket service for real-time communication

### Data Layer
- MySQL for persistent data storage
- Redis for caching, fast access layer, and performance optimization

### Realtime Pipeline
- External crypto APIs are polled every ~30 seconds
- Data is normalized and processed in backend services
- Cached in Redis and persisted in MySQL
- Broadcasted to clients via WebSockets in real time

---

##  Tech Stack

- Node.js
- TypeScript
- Express.js
- Nuxt.js
- MySQL
- Redis
- WebSockets
- JWT Authentication
- Google OAuth2
- i18n (multi-language system)
- Docker

---

##  Authentication

- JWT-based authentication for secure session handling
- Google OAuth2 login and registration flow
- Protected routes and role-based access control (if applicable)

---

##  Features

- Real-time cryptocurrency market tracking (~30s refresh cycle)
- Multi-service backend architecture
- REST API for data processing and mutations
- WebSocket-based real-time updates
- JWT + Google OAuth authentication system
- Redis caching layer for performance optimization
- MySQL persistent storage
- Multi-language interface (5 locales)
- IP/location-based logic handling
- Dockerized production deployment
- Actively running system used as a deployed product

---

##  Infrastructure & Deployment

- Fully containerized with Docker
- Environment-based configuration management
- Designed for production deployment and scaling
- Services run independently for modular architecture

---

##  Key Design Decisions

- Separation of backend responsibilities into independent services for scalability
- Redis introduced to reduce database load and improve response times
- WebSockets used for low-latency real-time communication
- External API aggregation layer isolates third-party dependencies
- SSR frontend improves performance and SEO
- Authentication system supports both JWT and OAuth2 flows

---

##  System Structure (simplified)

frontend/ → Nuxt application (SSR UI layer)
api-service/ → Express API (data processing & external API integration)
realtime-service/ → WebSocket + realtime delivery layer
database/ → MySQL schema & persistence layer
cache/ → Redis caching layer

---

##  Status
This is an actively running production system built as an independent product for real-world usage and continuous development.

---

##  Author

Vladimir Starovoit  
Backend Engineer | Node.js | TypeScript | Redis | MySQL | Realtime Systems
