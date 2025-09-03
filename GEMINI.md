# Project Overview

This application is an AI chat application that leverages Groq's high-speed LLM (Large Language Model) API, featuring a modern and intuitive UI. It is designed with privacy in mind; all user API keys and conversation histories are stored locally in the browser's local storage and are never sent to external servers.

## Key Features

*   **High-Speed AI Chat:** Real-time streaming responses utilizing the Groq API.
*   **Privacy-Focused:** API keys and conversation history are all stored locally.
*   **Responsive Design:** Comfortable to use on all devices, including PCs, tablets, and smartphones.
*   **Markdown Support:** Neatly displays code blocks and lists included in AI responses.
*   **Dark Mode:** Automatically follows the OS theme settings.
*   **Conversation History Management:** View and clear all conversation history.

## Technology Stack

*   **Framework:** Next.js 15 (App Router)
*   **UI Library:** React
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **State Management:** Zustand
*   **Data Persistence:** Web Storage API (localStorage)

# Building and Running

## Setup and Execution

### 1. Install Dependencies

In the project's root directory, run the following command to install the necessary packages:

```bash
npm install
```

### 2. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

### 3. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. API Key Configuration

1.  Access [GroqCloud](https://console.groq.com/keys) to obtain an API key.
2.  Open the application's "Settings" screen, enter the obtained API key, and save it.

## Deployment

This application is built with deployment to [Vercel](https://vercel.com/) in mind. Easy deployment is possible by linking with a GitHub repository.

# Development Conventions

This project follows standard Next.js development practices.

*   **Code Styling:** ESLint is used for code linting, and Prettier is likely used for code formatting (implied by `eslint.config.mjs`).
*   **Component Library:** `shadcn/ui` is used for UI components, ensuring a consistent and modern look and feel.
*   **State Management:** `Zustand` is used for managing application state.
*   **Styling:** `Tailwind CSS` is used for utility-first CSS styling.
*   **Type Safety:** TypeScript is used throughout the project for type checking and improved code quality.
