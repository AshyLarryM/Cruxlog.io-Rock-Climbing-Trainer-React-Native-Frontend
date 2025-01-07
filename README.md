# Cruxlog Frontend
## To Download CruxLog.io on the AppStore, head to - https://www.cruxlog.io/

This repository contains the React Native frontend for Cruxlog, a workout logger designed for rock climbers. The app is built with **React Native**, **Expo Router**, **React Query**, **Redux**, and **TypeScript** to provide a seamless user experience for logging and tracking climbing activities.

## Features

- **Workout Logging**: Users can log their climbing activities, including:
  - **Boulders**
  - **Routes**
  - **Top Rope**
- **User Authentication**: Integrates with Clerk for secure and seamless user authentication.
- **State Management**: Uses Redux for managing global state efficiently.
- **Data Fetching**: Implements React Query for efficient data fetching and caching.
- **Expo Router**: Simplifies navigation with a file-based routing system.
- **TypeScript**: Ensures type safety and improved developer experience.

## Tech Stack

- **Framework**: React Native
- **Navigation**: Expo Router
- **State Management**: Redux
- **Data Fetching**: React Query
- **Language**: TypeScript
- **Authentication**: Clerk

## Installation and Setup

### Prerequisites

- Node.js (>= 16.x)
- Expo CLI
- Yarn or npm

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/cruxlog-frontend.git
   cd cruxlog-frontend
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-publishable-key>
   BASE_URL=<your-backend-api-url>
   ```

4. **Start the Development Server**

   ```bash
   expo start
   ```

   The app can be accessed through the Expo Go app on your mobile device or an emulator.

## Folder Structure

- `src/`
  - `components/`: Reusable UI components.
  - `screens/`: App screens managed by Expo Router.
  - `redux/`: Redux slices and store configuration.
  - `hooks/`: Custom React hooks.
  - `services/`: API service functions for data fetching.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Inspired by the climbing community and Kaya
- Built with the support of modern tools like React Native, Redux, and Expo Router.

