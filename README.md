# Repositories Scoring Application

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
  - [Health Check](#get-/v1/health)
  - [Get scoring](#get-/v1/repositories/score)

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (>= 20.x)
- npm (>= 6.x) or yarn (>= 1.x)

This application was only tested on macOS 14.4.1.

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/pedroescumalha/redcare-code-challenge.git
   cd redcare-code-challenge
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Running the Application

1. **Setup environment variables:**
   ```sh
   npm run setup:env
   ```

   This command will create a default `.env` file with example environment variables. Make sure you have the correct ones for your environment.

2. **Start the server:**
   ```sh
   npm run dev
   ```

   This command will start the server on port 8080, or whatever you defined in your `.env` file.

## Technologies Used

- [Fastify](https://www.fastify.io/) - The server
- [Zod](https://zod.dev/) - For incoming requests and external requests data validation
- [Pino](https://github.com/pinojs/pino) - For logging
- [Dotenv](https://www.npmjs.com/package/dotenv) - For environment variables

## API Endpoints

### GET /v1/health
- Description: Retrieves the health of the application.
- Response: `200 OK`.

### GET /v1/repositories/score
- Description: Retrieves the popularity score of repositories. 
- Request Query Parameters: createdAt - The earliest creation date of the repositories; language: The language of the repositories; take: The number of repositories to retrieve (max 100); page: The page to retrieve.
- Response: `200 OK`, JSON array of the score of the repositories and additional identifying information.
