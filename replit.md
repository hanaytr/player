# TizenTV Pro - Smart TV Streaming Application

## Overview

TizenTV Pro is a modern streaming application designed for smart TVs, providing users with access to live channels, movies, and TV series. The application features a TV-optimized interface with keyboard navigation support, making it ideal for Samsung Tizen TVs and similar platforms. It offers a Netflix-like experience with content carousels, hero sections, and a comprehensive media management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, utilizing modern React patterns and hooks. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. The application uses Wouter for lightweight client-side routing and TanStack Query for efficient data fetching and caching.

**Key Design Decisions:**
- **React with TypeScript**: Provides type safety and modern development experience
- **shadcn/ui + Radix UI**: Ensures accessibility and consistent design system
- **Tailwind CSS**: Enables rapid styling with a utility-first approach
- **TV Navigation**: Custom keyboard navigation system optimized for remote control input

### Backend Architecture
The server follows a REST API pattern built with Express.js and TypeScript. It implements a layered architecture with clear separation between routing, business logic, and data storage. The storage layer uses an interface-based approach, currently implemented with in-memory storage but designed to easily migrate to database solutions.

**Key Design Decisions:**
- **Express.js with TypeScript**: Provides familiar REST API development with type safety
- **Interface-based Storage**: Allows easy swapping between storage implementations
- **Middleware Pattern**: Handles logging, error management, and request processing
- **Development/Production Split**: Vite integration for development, static serving for production

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL for data persistence. The schema defines comprehensive models for users, channels, movies, series, episodes, favorites, and watch history. The current implementation includes an in-memory storage class that implements the storage interface, making it easy to migrate to the database when needed.

**Key Design Decisions:**
- **Drizzle ORM**: Provides type-safe database queries and migrations
- **PostgreSQL**: Chosen for robust relational data handling
- **Schema-first Design**: Centralized data models shared between client and server
- **Interface Abstraction**: Storage layer can be swapped without affecting business logic

### Authentication and Authorization
The current implementation does not include authentication mechanisms, using mock user data for development. The architecture is prepared for future authentication integration with user session management and role-based access control.

### TV-Optimized User Experience
The application is specifically designed for television interfaces with several key optimizations:

**Navigation System:**
- Custom keyboard navigation hook handling arrow key movement
- Focus management for carousel scrolling and content selection
- TV-safe color schemes and focus indicators

**Content Organization:**
- Hero sections for featured content promotion
- Horizontal carousels for content discovery
- Category-based content grouping
- Continue watching functionality with progress tracking

**Performance Optimizations:**
- React Query for efficient data caching and background updates
- Lazy loading and image optimization
- Minimal bundle size for TV hardware constraints

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features and hooks
- **Express.js**: Web server framework for REST API
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast build tool and development server

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Schema validation integration

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefix automation

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling (conditional)

The application is configured to work seamlessly in the Replit environment while maintaining production deployment capabilities through the build system.