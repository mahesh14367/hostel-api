# Hostel Management API

A comprehensive RESTful API for managing hostel operations with advanced analytics, validation, and enterprise-level SQL operations.

## Features

### Core Management
- **Room Management**: Create, read, update, and delete rooms
- **Bed Management**: Manage beds within rooms, track availability
- **Tenant Management**: Complete tenant lifecycle management
- **Payment Tracking**: Record and track tenant payments
- **Food Menu Management**: Weekly and daily meal planning
- **Complaint System**: Track and resolve tenant complaints

### Advanced Analytics
- **Occupancy Analytics**: Real-time occupancy rates by room type
- **Revenue Analytics**: Monthly revenue tracking and projections
- **Tenant Analytics**: Comprehensive tenant statistics and insights
- **Payment Analytics**: Payment patterns and pending payment tracking
- **Complaint Analytics**: Complaint resolution metrics and trends
- **Financial Dashboard**: Complete financial overview with aggregations

### Advanced SQL Operations
- **Views**: Optimized database views for complex queries
- **Triggers**: Automated data integrity and status updates
- **Stored Procedures**: Complex business operations encapsulation
- **Cursors**: Batch processing for large datasets
- **Subqueries**: Advanced filtering and data analysis
- **Aggregate Functions**: SUM, AVG, COUNT with GROUP BY operations

### Data Validation
- **Type-safe Validation**: Valibot-based request validation
- **Modular Validation**: Decentralized validation per module
- **Automatic Error Handling**: Consistent error responses
- **Input Sanitization**: Secure data processing

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MySQL** database with raw SQL queries
- **MySQL2** driver for database connectivity
- **Valibot** for data validation
- **Advanced SQL**: Views, Triggers, Stored Procedures, Cursors

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

4. Set up database:
```bash
# Create database and run the advanced SQL operations script
mysql -u root -p < src/database/advanced-sql-operations.sql
```

5. Build the project:
```bash
npm run build
```

6. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

### Database Setup

The application requires MySQL database with the following tables and objects:

**Tables:**
- `ROOM` - Room information
- `BED` - Bed details linked to rooms  
- `TENANT` - Tenant information
- `PAYMENT` - Payment records
- `FOOD_MENU` - Weekly meal plans
- `COMPLAINT` - Tenant complaints
- `PAYMENT_AUDIT` - Payment audit trail

**Database Objects:**
- **Views**: `tenant_details`, `payment_summary`, `room_occupancy_analytics`, `complaint_analytics`, `financial_dashboard`
- **Triggers**: Automatic bed status updates, payment audit logging
- **Stored Procedures**: Monthly rent processing, occupancy reporting, payment status updates

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

### Analytics

#### Basic Analytics
- `GET /analytics/occupancy-rate` - Get occupancy rate by room type
- `GET /analytics/revenue-summary` - Get monthly revenue summary
- `GET /analytics/tenant-statistics` - Get tenant statistics
- `GET /analytics/room-statistics` - Get room statistics
- `GET /analytics/payment-analytics` - Get payment analytics
- `GET /analytics/tenants-pending-payments` - Get tenants with pending payments
- `GET /analytics/most-expensive-room` - Get most expensive room
- `GET /analytics/empty-rooms` - Get empty rooms
- `GET /analytics/comprehensive` - Get comprehensive analytics

#### Advanced Analytics - Views
- `GET /advanced-analytics/views/tenant-details` - Get tenant details view
- `GET /advanced-analytics/views/tenant-details/:id` - Get tenant details by ID
- `GET /advanced-analytics/views/payment-summary` - Get payment summary view
- `GET /advanced-analytics/views/room-occupancy` - Get room occupancy analytics view
- `GET /advanced-analytics/views/complaint-analytics` - Get complaint analytics view
- `GET /advanced-analytics/views/financial-dashboard` - Get financial dashboard view

#### Advanced Analytics - Subqueries
- `GET /advanced-analytics/subqueries/above-average-rent` - Get tenants with above-average rent
- `GET /advanced-analytics/subqueries/below-average-occupancy` - Get rooms below average occupancy
- `GET /advanced-analytics/subqueries/long-pending-complaints` - Get long pending complaints
- `GET /advanced-analytics/subqueries/payment-issues` - Get tenants with payment issues

#### Advanced Analytics - Stored Procedures
- `POST /advanced-analytics/procedures/process-rent` - Process monthly rent
- `GET /advanced-analytics/procedures/occupancy-report` - Generate occupancy report
- `PUT /advanced-analytics/procedures/update-payment-status` - Update tenant payment status

#### Advanced Analytics - Cursor Operations
- `POST /advanced-analytics/cursors/update-room-status` - Batch update room status
- `GET /advanced-analytics/cursors/process-payments` - Process pending payments batch

#### Advanced Analytics - Business Intelligence
- `GET /advanced-analytics/advanced/problematic-accounts` - Flag problematic accounts
- `GET /advanced-analytics/advanced/revenue-projection` - Get revenue projection
- `GET /advanced-analytics/advanced/pricing-strategy` - Get optimal pricing strategy

## API Documentation for Frontend Development

### Authentication
Currently no authentication system is implemented. All endpoints are open for development.

### Request/Response Examples

#### Room Management
```http
POST /api/rooms
Content-Type: application/json

{
  "room_type": "Deluxe",
  "rent": 5000,
  "status": "available"
}
```

```json
{
  "success": true,
  "data": {
    "room_id": 1,
    "room_type": "Deluxe",
    "rent": 5000,
    "status": "available"
  },
  "message": "Room created successfully"
}
```

#### Tenant Management
```http
POST /api/tenants
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "aadhaar": "123456789012",
  "join_date": "2024-01-15",
  "bed_id": 1
}
```

```json
{
  "success": true,
  "data": {
    "tenant_id": 1,
    "name": "John Doe",
    "phone": "9876543210",
    "aadhaar": "123456789012",
    "join_date": "2024-01-15",
    "bed_id": 1,
    "bed_number": 1,
    "room_type": "Deluxe",
    "room_number": 101
  },
  "message": "Tenant created successfully"
}
```

#### Payment Management
```http
POST /api/payments
Content-Type: application/json

{
  "tenant_id": 1,
  "amount": 5000,
  "payment_date": "2024-01-15",
  "payment_mode": "cash",
  "status": "completed"
}
```

```json
{
  "success": true,
  "data": {
    "payment_id": 1,
    "tenant_id": 1,
    "amount": 5000,
    "payment_date": "2024-01-15",
    "payment_mode": "cash",
    "status": "completed",
    "tenant_name": "John Doe",
    "tenant_phone": "9876543210"
  },
  "message": "Payment created successfully"
}
```

#### Analytics Examples

##### Get Occupancy Rate
```http
GET /api/analytics/occupancy-rate
```

```json
{
  "success": true,
  "data": [
    {
      "room_type": "Deluxe",
      "total_beds": 20,
      "occupied_beds": 15,
      "available_beds": 5,
      "occupancy_rate": 75.00
    },
    {
      "room_type": "Standard",
      "total_beds": 30,
      "occupied_beds": 20,
      "available_beds": 10,
      "occupancy_rate": 66.67
    }
  ],
  "message": "Occupancy rate data retrieved successfully"
}
```

##### Get Revenue Summary
```http
GET /api/analytics/revenue-summary
```

```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "payment_count": 25,
      "total_amount": 125000,
      "pending_amount": 5000,
      "completed_amount": 120000
    },
    {
      "month": "2024-02",
      "payment_count": 28,
      "total_amount": 140000,
      "pending_amount": 8000,
      "completed_amount": 132000
    }
  ],
  "message": "Revenue summary data retrieved successfully"
}
```

##### Get Comprehensive Analytics
```http
GET /api/analytics/comprehensive
```

```json
{
  "success": true,
  "data": {
    "total_rooms": 10,
    "available_rooms": 2,
    "total_beds": 50,
    "occupied_beds": 35,
    "available_beds": 15,
    "total_tenants": 35,
    "new_tenants_this_month": 5,
    "total_revenue": 252000,
    "pending_revenue": 13000,
    "payments_this_month": 12,
    "total_complaints": 8,
    "pending_complaints": 3,
    "resolved_complaints": 5,
    "overall_occupancy_rate": 70.00
  },
  "message": "Comprehensive analytics retrieved successfully"
}
```

### Data Models for Frontend

#### Room Model
```typescript
interface Room {
  room_id: number;
  room_type: string;
  rent: number;
  status: 'available' | 'occupied' | 'maintenance';
}
```

#### Bed Model
```typescript
interface Bed {
  bed_id: number;
  room_id: number;
  bed_number: number;
  status: 'available' | 'occupied' | 'maintenance';
}
```

#### Tenant Model
```typescript
interface Tenant {
  tenant_id: number;
  name: string;
  phone: string;
  aadhaar: string;
  join_date: string;
  bed_id: number;
  bed_number?: number;
  room_type?: string;
  room_number?: number;
}
```

#### Payment Model
```typescript
interface Payment {
  payment_id: number;
  tenant_id: number;
  amount: number;
  payment_date: string;
  payment_mode: string;
  status: 'pending' | 'completed' | 'failed';
  tenant_name?: string;
  tenant_phone?: string;
}
```

#### FoodMenu Model
```typescript
interface FoodMenu {
  menu_id: number;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}
```

#### Complaint Model
```typescript
interface Complaint {
  complaint_id: number;
  tenant_id: number;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  tenant_name?: string;
  tenant_phone?: string;
}
```

#### Analytics Models
```typescript
interface OccupancyRate {
  room_type: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_rate: number;
}

interface RevenueSummary {
  month: string;
  payment_count: number;
  total_amount: number;
  pending_amount: number;
  completed_amount: number;
}

interface ComprehensiveAnalytics {
  total_rooms: number;
  available_rooms: number;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  total_tenants: number;
  new_tenants_this_month: number;
  total_revenue: number;
  pending_revenue: number;
  payments_this_month: number;
  total_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
  overall_occupancy_rate: number;
}
```

### Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Validation errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "room_type",
      "message": "Room type is required"
    }
  ]
}
```

### Frontend Implementation Tips

1. **Base URL**: `http://localhost:3000/api`
2. **Content-Type**: Always use `application/json`
3. **Error Handling**: Check `success` field before accessing `data`
4. **Date Format**: Use `YYYY-MM-DD` for date fields
5. **ID Parameters**: Use numeric IDs for path parameters
7. **Pagination**: Not implemented yet, add as needed

### Sample Frontend API Client


## Database Schema

### Tables
- `ROOM` - Room information (room_id, room_type, rent, status)
- `BED` - Bed details linked to rooms (bed_id, room_id, bed_number, status)
- `TENANT` - Tenant information (tenant_id, name, phone, aadhaar, join_date, bed_id)
- `PAYMENT` - Payment records (payment_id, tenant_id, amount, payment_date, payment_mode, status)
- `FOOD_MENU` - Weekly meal plans (menu_id, day, breakfast, lunch, dinner)
- `COMPLAINT` - Tenant complaints (complaint_id, tenant_id, description, status, created_at)
- `PAYMENT_AUDIT` - Payment audit trail (audit_id, payment_id, tenant_id, amount, action_type, created_at)

### Database Objects
- **Views**: Pre-computed complex queries for performance
- **Triggers**: Automated data integrity and audit logging
- **Stored Procedures**: Encapsulated business logic operations
- **Indexes**: Optimized for query performance

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

Validation errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "room_type",
      "message": "Room type is required"
    }
  ]
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
|-- config/                 # Configuration files
|   |-- app.ts             # Application configuration
|   `-- database.ts        # Database connection setup
|-- database/               # Database scripts
|   `-- advanced-sql-operations.sql  # Views, triggers, procedures
|-- modules/               # Feature modules
|   |-- room/              # Room module (service, controller, routes, validation)
|   |-- bed/               # Bed module (service, controller, routes, validation)
|   |-- tenant/            # Tenant module (service, controller, routes, validation)
|   |-- payment/           # Payment module (service, controller, routes, validation)
|   |-- food-menu/         # Food menu module (service, controller, routes, validation)
|   |-- complaint/         # Complaint module (service, controller, routes, validation)
|   `-- analytics/         # Analytics module
|       |-- analytics.service.ts     # Basic analytics
|       |-- analytics.controller.ts  # Basic analytics controller
|       |-- analytics.routes.ts      # Basic analytics routes
|       `-- advanced/                 # Advanced SQL operations
|           |-- advanced-analytics.service.ts
|           |-- advanced-analytics.controller.ts
|           `-- advanced-analytics.routes.ts
|-- scripts/               # Utility scripts
|   `-- test-db.ts        # Database connection test
|-- utils/                 # Shared utilities
|   `-- validation.ts     # Centralized validation schemas
|-- app.ts                 # Express app configuration
|-- server.ts              # Server startup
`-- routes.ts              # Main routes
```

### Validation System

The application uses **Valibot** for type-safe validation:

- **Decentralized Validation**: Each module has its own validation file
- **Type Safety**: Full TypeScript integration
- **Automatic Error Handling**: Consistent validation error responses
- **Reusable Schemas**: Shared validation logic across endpoints

### Advanced SQL Features

- **Views**: Optimized read operations for complex queries
- **Triggers**: Automatic data integrity maintenance
- **Stored Procedures**: Encapsulated business logic
- **Cursors**: Efficient batch processing
- **Subqueries**: Advanced data filtering and analysis
- **Aggregate Functions**: SUM, AVG, COUNT with GROUP BY

## License

ISC
