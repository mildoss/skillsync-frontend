# SkillSync Frontend - Main Web Client

A modern, responsive, and highly interactive frontend application for the SkillSync Job Board platform, built with Next.js, React, and Tailwind CSS.

## Overview

The SkillSync Frontend serves as the primary user interface for both job seekers (Applicants) and employers. It provides a seamless experience for browsing vacancies, managing company profiles, handling job applications, and communicating in real-time. The application leverages Next.js App Router for optimized server-side rendering (SSR) and seamless client-side navigation, seamlessly integrating with the SkillSync microservices ecosystem.

## Features

- **Role-Based Dashboards**: Dedicated interfaces and workflows for both `APPLICANT` and `EMPLOYER` roles.
- **Real-time Chat**: Integrated WebSocket communication via Socket.io for instant messaging between recruiters and candidates.
- **AI-Powered Tools**: Seamless integration with the AI service to generate cover letters, craft vacancy descriptions, and evaluate candidate match scores using a token-based billing system.
- **Advanced Filtering & Search**: Comprehensive search for vacancies and candidates using debounced queries and multi-select filters (skills, categories, domains, work formats).
- **Secure Authentication**: Custom proxy middleware handling secure HttpOnly cookies (`access-token`, `refresh-token`) and automatic token refreshing.
- **Modern UI/UX**: Fully responsive, accessible design built with Tailwind CSS, Radix UI primitives, and dark mode support (`next-themes`).
- **Form Validation**: Robust client and server-side validation using `react-hook-form` and `zod`.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | Framework |
| React | UI Library |
| TypeScript | Language |
| Tailwind CSS | Styling |
| Radix UI / shadcn/ui | UI Components |
| React Hook Form + Zod | State & Validation |
| Socket.io Client | Real-time Communication |

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Running instances of SkillSync Backend services (Core, Auth, AI, Payment)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mildoss/skillsync-frontend.git
cd skillsync-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
# Backend (GATEWAY) API URL (Server-side)
BACKEND_URL=http://localhost:3000

# Public Socket.io URL (Client-side)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

> Adjust the URLs based on where your core backend and WebSocket gateway are running.

## Usage

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The application will start on `http://localhost:3000` (or 3001 if the port is busy).

### Production Build

Build the Next.js application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
.
├── actions/              # Next.js Server Actions (auth, ai, company, chat, etc.)
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (dashboard)/      # Protected dashboard routes (profile, applications, billing)
│   └── (main)/           # Public routes (home, vacancies, companies, pricing)
├── components/           # Reusable React components
│   ├── applications/     # Application cards, status badges, modals
│   ├── chats/            # Real-time chat interfaces
│   ├── layout/           # Header, Sidebar, ThemeToggle, NotificationBell
│   ├── ui/               # Base UI components (Buttons, Inputs, Modals, etc.)
│   └── ...
├── hooks/                # Custom React hooks (use-chat-socket, use-debounce, etc.)
├── lib/                  # Utilities, API fetchers, constants, and Zod schemas
└── types/                # TypeScript interfaces (User, Vacancy, Chat, AI, etc.)
```

## Development Guidelines

- **Server Actions**: All mutations (POST, PATCH, DELETE) and secured data fetching are handled via Server Actions in the `actions/` directory, passing authorization headers automatically.

- **API Fetching**: Read-only public or cached data is fetched using standard `fetch` in `lib/api.ts` and `lib/server-api.ts`.

- **Styling**: Use Tailwind CSS utility classes. Avoid creating custom CSS unless absolutely necessary (added to `app/globals.css`).

- **State Management**: Favor URL search parameters for filter states (`hooks/use-filter.ts`) to ensure shareable links and SSR compatibility.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is UNLICENSED — see the `package.json` file for details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Related Projects

This is the frontend client for the SkillSync platform ecosystem. Other microservices include:

- [SkillSync Backend - Core Service](#)
- [SkillSync Backend - Payment Service](#)
- [SkillSync Backend - AI Service](#)
- [SkillSync Backend - Auth Service](#)