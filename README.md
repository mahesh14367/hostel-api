# Hostel Management API

A comprehensive RESTful API for managing hostel operations including rooms, beds, tenants, payments, food menus, and complaints.

## Features

- **Room Management**: Create, read, update, and delete rooms
- **Bed Management**: Manage beds within rooms, track availability
- **Tenant Management**: Complete tenant lifecycle management
- **Payment Tracking**: Record and track tenant payments
- **Food Menu Management**: Weekly and daily meal planning
- **Complaint System**: Track and resolve tenant complaints

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MySQL** database with raw SQL queries
- **MySQL2** driver for database connectivity

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mahesh14367/hostel-api.git
cd hostel-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` file with your database configuration.

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Rooms
- `GET /rooms` - Get all rooms
- `GET /rooms/available` - Get available rooms
- `GET /rooms/:id` - Get room by ID
- `POST /rooms` - Create new room
- `PUT /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room

### Beds
- `GET /beds` - Get all beds
- `GET /beds/available` - Get available beds
- `GET /beds/room/:roomId` - Get beds by room
- `GET /beds/room/:roomId/available` - Get available beds by room
- `GET /beds/:id` - Get bed by ID
- `POST /beds` - Create new bed
- `PUT /beds/:id` - Update bed
- `DELETE /beds/:id` - Delete bed

### Tenants
- `GET /tenants` - Get all tenants
- `GET /tenants/phone/:phone` - Get tenant by phone
- `GET /tenants/aadhaar/:aadhaar` - Get tenant by Aadhaar
- `GET /tenants/room/:roomId` - Get tenants by room
- `GET /tenants/:id` - Get tenant by ID
- `POST /tenants` - Create new tenant
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant

### Payments
- `GET /payments` - Get all payments
- `GET /payments/pending` - Get pending payments
- `GET /payments/revenue` - Get total revenue
- `GET /payments/status/:status` - Get payments by status
- `GET /payments/date-range` - Get payments by date range
- `GET /payments/tenant/:tenantId` - Get payments by tenant
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Create new payment
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### Food Menu
- `GET /food-menu` - Get all food menus
- `GET /food-menu/weekly` - Get weekly menu
- `GET /food-menu/today` - Get today's menu
- `GET /food-menu/day/:day` - Get menu by day
- `GET /food-menu/:id` - Get menu by ID
- `POST /food-menu` - Create new food menu
- `PUT /food-menu/:id` - Update food menu
- `PUT /food-menu/day/:day` - Update menu by day
- `DELETE /food-menu/:id` - Delete food menu

### Complaints
- `GET /complaints` - Get all complaints
- `GET /complaints/pending` - Get pending complaints
- `GET /complaints/resolved` - Get resolved complaints
- `GET /complaints/status/:status` - Get complaints by status
- `GET /complaints/date-range` - Get complaints by date range
- `GET /complaints/tenant/:tenantId` - Get complaints by tenant
- `GET /complaints/:id` - Get complaint by ID
- `POST /complaints` - Create new complaint
- `PUT /complaints/:id` - Update complaint
- `PUT /complaints/:id/status` - Update complaint status
- `DELETE /complaints/:id` - Delete complaint

## Database Schema

The API uses the following tables:
- `ROOM` - Room information
- `BED` - Bed details linked to rooms
- `TENANT` - Tenant information
- `PAYMENT` - Payment records
- `FOOD_MENU` - Weekly meal plans
- `COMPLAINT` - Tenant complaints

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

### Project Structure
```
src/
├── config/          # Configuration files
├── modules/         # Feature modules
│   ├── room/        # Room module
│   ├── bed/         # Bed module
│   ├── tenant/      # Tenant module
│   ├── payment/     # Payment module
│   ├── food-menu/   # Food menu module
│   └── complaint/   # Complaint module
├── scripts/         # Utility scripts
├── app.ts           # Express app configuration
├── server.ts        # Server startup
└── routes.ts        # Main routes
```

## License

ISC
