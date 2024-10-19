# Weather Monitor Application

The Weather Monitor application is a web-based platform designed to provide users with real-time weather monitoring, alerts, and historical trends. It features an intuitive interface, allowing users to navigate through different functionalities such as viewing daily summaries, setting thresholds for alerts, and exploring historical weather trends.

## Table of Contents

1. [Frontend](#frontend)
    - [Technology Used](#technologies-used)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
    - [Design Choices](#design-choices)
    - [Dependencies](#dependencies)
2. [Backend](#backend)
    - [Technology Used](#technologies-used-1)
    - [Installation](#installation-1)
    - [Running the Application](#running-the-application-1)
    - [Design Choices](#design-choices-1)
    - [Dependencies](#dependencies-1)

## Frontend

### Technologies Used

- **React.js:** For building user interfaces.
- **React Router:** For handling routing within the application.
- **Bootstrap:** For responsive design and UI components.
- **Axios:** For making API requests.
- **Chart.js:** For data visualization of weather trends.


### Installation

1. CLone the repository
```bash
git clone
cd frontend
```
2. Install dependencies
```bash
npm install
#or
yarn install
```

### Running the Application
To start the development server, run:
```bash
npm start
#or
yarn start
```

The application will be accessible at `http://localhost:3000`.

### Design Choices

- **Responsive Layout:** The application is built to be responsive, ensuring a seamless experience on both 
  desktop and mobile devices.
- **Component-Based Architecture:** Leveraging React’s component-based architecture for modular development, 
  making it easier to manage and scale the application.
- **State Management:** Using React's built-in state management for handling user interactions and data updates 
  efficiently.


### Dependencies

The following dependencies are included in the `frontend/package.json`:

- **axios:** For making HTTP requests to the backend.
- **bootstrap:** For styling and layout.
- **chart.js:** For rendering charts and graphs.
- **react-icons:** For including icons throughout the application.
- **react-router-dom:** For navigation between different pages.


## Backend

### Technologies Used

- **Node.js:** JavaScript runtime for building server-side applications.
- **Express:** A minimal and flexible Node.js web application framework for building APIs.
- **MongoDB:** NoSQL database for data storage, accessed via Mongoose for object modeling.
- **Node-Cron:** For scheduling tasks to fetch weather data periodically.
- **Nodemailer:** For sending email notifications and alerts.


### Installation

1. CLone the repository
```bash
git clone
cd backend
```
2. Install dependencies
```bash
npm install
#or
yarn install
```

### Running the Application
To start the backend server, run:
```bash
npm start
#or
yarn start
```

The server will be accessible at `http://localhost:5000`.

### Environment Variables
Create a `.env` file in the backend root directory and add the following environment variables:

```bash
PORT=5000
MONGO_URI=<your-mongo-db-uri>
OPEN_WEATHER_API_KEY=<your-openweather-api-key>
EMAIL_USERNAME=<your-email-user>
EMAIL_PASSWORD=<your-email-password>
ALERT_EMAIL=<your-alert-email>
```
Make sure to replace the placeholder values with your actual credentials.

### Design Choices

- **Express Framework:** Using Express.js for building the RESTful API to handle requests from the frontend 
  efficiently.
- **MongoDB:** Leveraging Mongoose to interact with MongoDB for data storage and retrieval.
- **Cron Jobs:** Utilizing `node-cron` to schedule background tasks for fetching and processing weather data 
  periodically.
- **Email Notifications:** Using nodemailer to send alerts and notifications to users.


### Dependencies

The following dependencies are included in the backend/package.json:

- **axios:** For making HTTP requests.
- **cors:** To enable Cross-Origin Resource Sharing.
- **dotenv:** For loading environment variables.
- **express:** The web framework for building APIs.
- **mongoose:** For MongoDB object modeling.
- **node-cron:** For scheduling tasks.
- **nodemailer:** For sending emails.

