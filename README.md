# SportifsEvents-React Documentation

## 📑 Table of Contents
1. [Overview](#overview)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Components Documentation](#components-documentation)
7. [API Integration](#api-integration)
8. [Styling Guide](#styling-guide)
9. [State Management](#state-management)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Overview

SportifsEvents-React is a modern web application built to manage and display sports events. The application provides a user-friendly interface for viewing, creating, and managing sports events.

## Technical Stack

### Core Technologies
- **React 18**: Frontend library
- **TypeScript**: For type-safe code
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### Additional Dependencies
- **React Router DOM**: For routing
- **Axios**: HTTP client for API requests
- **React Icons**: For UI icons
- **@headlessui/react**: For accessible UI components

## Project Structure

SportifsEvents-React/
├── src/
│ ├── components/
│ │ ├── common/
│ │ │ ├── Button/
│ │ │ ├── Input/
│ │ │ └── Card/
│ │ ├── layout/
│ │ └── features/
│ ├── pages/
│ ├── services/
│ ├── hooks/
│ ├── utils/
│ ├── types/
│ ├── assets/
│ └── App.tsx
├── public/
├── config/
└── package.json


## Features

### 1. Event Management
- View list of sports events
- Create new events
- Edit existing events
- Delete events
- Filter and search functionality

### 2. User Interface
- Responsive design for all devices
- Modern and clean UI
- Interactive components
- Loading states and animations

### 3. Data Management
- Real-time updates
- Data persistence
- Error handling
- Form validation

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Step-by-Step Installation

1. **Clone the Repository**

bash
git clone https://github.com/HakiMohamed/SportifsEvents-React.git
cd SportifsEvents-React
bash
npm install
env
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
bash
npm run dev
typescript
interface EventCardProps {
title: string;
date: string;
location: string;
description: string;
image?: string;
}
typescript
const fetchEvents = async () => {
try {
const response = await axios.get(${API_URL}/events);
return response.data;
} catch (error) {
console.error('Error fetching events:', error);
throw error;
}
};
javascript
// tailwind.config.js
module.exports = {
theme: {
extend: {
colors: {
primary: '#...',
secondary: '#...',
},
// Other customizations
}
}
}
bash
npm run test
bash
npm run test:coverage
bash
npm run build
