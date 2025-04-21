# XN Doughs Surplus Box Reservation System

A web application for managing surplus box reservations at XN Doughs, featuring real-time availability, OTP verification via WhatsApp, and an admin dashboard.

## Features

- View available surplus boxes with descriptions and discounts
- Reserve boxes with specific preferences
- OTP verification via WhatsApp
- Real-time countdown timer for pickup
- Admin dashboard for managing reservations and boxes
- Auto-cancel reservations after 15 minutes of delay

## Tech Stack

- Vue.js 3
- Vite
- Tailwind CSS
- Pinia (State Management)
- Vue Router

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── views/          # Page components
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
└── main.js         # Application entry point
```

## Deployment

The application is configured for deployment on Netlify. Simply connect your repository and deploy.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_WHATSAPP_NUMBER=96176814151
```

## License

MIT 