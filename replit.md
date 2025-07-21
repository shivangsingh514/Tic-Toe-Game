# Tic Tac Toe Game - Replit Development Guide

## Overview

This is a modern, animated Tic Tac Toe game built with React, TypeScript, and Express. The application features a sleek UI with smooth animations, score tracking, and a responsive design. It's structured as a full-stack application with a React frontend and Express backend, though the current implementation focuses primarily on the frontend game experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth game animations
- **State Management**: React hooks (useState, useEffect) for local game state
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Build Tool**: Vite for frontend, esbuild for backend bundling

### Development Setup
- **Package Manager**: NPM
- **Development Server**: Vite dev server with HMR
- **Type Checking**: TypeScript with strict mode enabled
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer

## Key Components

### Game Logic (`client/src/components/TicTacToe.tsx`)
- Manages game state including board, current player, winner detection
- Implements win pattern checking for rows, columns, and diagonals
- Handles score tracking across multiple games
- Provides reset functionality for new games

### UI Components (`client/src/components/ui/`)
- Complete Shadcn/ui component library
- Radix UI primitives for accessibility
- Custom styled components with Tailwind CSS
- Toast notifications for user feedback

### Shared Schema (`shared/schema.ts`)
- Drizzle ORM schema definitions
- User model with username/password authentication
- Zod validation schemas for type safety

### Storage Layer (`server/storage.ts`)
- Interface-based storage abstraction
- In-memory storage implementation for development
- Prepared for database integration with Drizzle ORM

## Data Flow

### Game Flow
1. User clicks on game board cell
2. Game logic validates move and updates board state
3. Win condition checking occurs after each move
4. Score tracking updates on game completion
5. Smooth animations provide visual feedback

### Authentication Flow (Prepared)
- User registration/login through API endpoints
- Session management with PostgreSQL store
- Protected routes and user state management

### API Communication
- RESTful API structure with `/api` prefix
- JSON request/response format
- Error handling with proper HTTP status codes
- Request logging middleware for development

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI/Styling**: Radix UI, Tailwind CSS, Framer Motion
- **Backend**: Express, Drizzle ORM, Neon Database
- **Development**: Vite, TypeScript, esbuild

### UI Component Library
- Comprehensive Shadcn/ui component set
- Accessible components with keyboard navigation
- Dark/light theme support with CSS variables
- Responsive design patterns

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server to `dist/index.js`
- Static assets served from built frontend directory

### Environment Configuration
- Database URL required via `DATABASE_URL` environment variable
- Development vs production environment detection
- Replit-specific plugins and configurations

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema changes managed through `drizzle-kit push`
- PostgreSQL dialect with Neon serverless database

### Development vs Production
- Development: Vite dev server with HMR and error overlay
- Production: Express serves built static files
- Environment-specific build optimizations

## Notes for Development

The application is currently focused on the frontend game experience with a prepared backend structure. The game works entirely in the browser with local state management. The backend infrastructure is ready for adding features like user accounts, game history, and multiplayer functionality.

The codebase uses modern React patterns with TypeScript for type safety. All UI components follow accessibility best practices through Radix UI primitives. The styling system uses Tailwind CSS with a well-organized design token system.