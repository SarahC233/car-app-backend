# Car Insurance Prediction Tool - Backend

This repository contains the backend code for the Car Insurance Prediction Tool, a full-stack application that uses Azure Custom Vision to identify the type of vehicle from an uploaded image and provides an insurance premium estimate based on the identified vehicle type.

## Features

- Upload an image to the server for vehicle type prediction. 
- Return the predicted vehicle type, confidence level, and insurance premium estimate.

## Tech Stack

- Node.js
- Express
- Azure Custom Vision
- Multer
- dotenv

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Azure Custom Vision accountn with a trained model

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/SarahC233/car-app-backend.git
   cd car-app-backend
   ```

   2. **Install Dependancies:**

      ```sh
      npm install
      ```

  3.  **Create a `.env` file in the root directory and add your Azure Custom Vision credentials:**
   ```sh
    VISION_PREDICTION_KEY=your_prediction_key
    VISION_PREDICTION_ENDPOINT=your_prediction_endpoint
    PROJECT_ID=your_project_id
    PUBLISH_ITERATION_NAME=your_iteration_name
    PORT=3000
   ```

  4.  **Start the server:**
```sh
npm start
```
The server will run on `http://localhost:3000`

### API Endpoints
- `GET /`: Root route to check server status
- `GET /health`: Health check endpoint to ensure server is running.
- `POST /predict`: Endpoint to upload an image and get the vehicle type prediction and premium estimate. 

  
  ## Usage
1. **Upload an image of a vehicle using the frontend application or an API client like Postman.**
2. **Receive the prediction result, including the vehicle type, confidence level, and premium estimate.**

### License
This project is lecensed under the MIT License. 
