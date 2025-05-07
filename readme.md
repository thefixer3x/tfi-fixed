# TFI-FIXED

A beautiful, interactive interface for AI innovations. This application provides a modern web interface for interacting with AI while offering conversation management and a seamless user experience.

![TFI-FIXED](https://placehold.co/600x400?text=TFI-FIXED&font=montserrat)

## Features

- 🤖 **AI Integration**: Connect with powerful language models via secure API calls
- 💬 **Conversation Management**: Create, save, and organize conversations
- 🌓 **Dark/Light Mode**: Toggle between light and dark themes based on preference or system settings
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔒 **Secure Authentication**: Uses Supabase authentication for secure user login
- 🧩 **Component-based Architecture**: Built with reusable React components
- 📊 **Context Preservation**: Maintains conversation context for better responses

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - TailwindCSS for styling
  - React Router for navigation
  - Lucide React for icons
  
- **Backend/Services**:
  - Supabase for authentication and database
  - Supabase Edge Functions for serverless API calls
  - AI API integration
  
- **Development Tools**:
  - Vite for fast development and optimized production builds
  - ESLint for code quality
  - TypeScript for type safety

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account
- AI API access

### Setup

1. Clone the repository:

```bash
git clone https://github.com/thefixer3x/tfi-fixed.git
cd tfi-fixed
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_SUPABASE_URL | Your Supabase project URL | https://yourproject.supabase.co |
| VITE_SUPABASE_ANON_KEY | Your Supabase anonymous key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| VITE_API_BASE_URL | URL for your API or edge function | https://yourproject.functions.supabase.co |

## Supabase Setup

### Database Tables

Create the following tables in your Supabase database:

**conversations**
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- title (text)
- created_at (timestamp with time zone, default: now())

**messages**
- id (uuid, primary key)
- conversation_id (uuid, foreign key to conversations)
- role (text, check: role in ('user', 'assistant'))
- content (text)
- created_at (timestamp with time zone, default: now())

### Edge Functions

1. Create a new Edge Function in Supabase called `ai` that handles the API calls to your AI provider.
2. Use the content from `ai-edge-function.ts` as a reference.
3. Set the following secrets in your Supabase project:

```bash
supabase secrets set AI_API_KEY=your_ai_api_key
```

## Usage

### Authentication

The application requires users to sign in to use the chat interface. Users can:
- Sign up with email/password
- Sign in with existing credentials
- Reset password if forgotten

### Chat Interface

1. Create a new conversation by clicking the "New Conversation" button
2. Type your message in the input box and press Enter or click the send button
3. View the AI's response in the conversation window
4. Previous conversations can be accessed from the sidebar

### Theme Switching

Toggle between light and dark modes using the theme switch in the sidebar.

## Development Workflow

### Code Structure

The project follows a feature-based organization:

```
TFI_FIXED/
  ├── components/      # Reusable UI components
  │   ├── ui/          # Base UI components
  │   └── chat/        # Chat-specific components
  ├── lib/             # Utility and service functions
  ├── pages/           # Page components
  ├── layouts/         # Layout components
  ├── types/           # TypeScript type definitions
  └── styles/          # Global styles
```

### Adding New Features

1. Create components in the appropriate directory
2. Add types to `types/` directory
3. Implement service functions in `lib/` directory
4. Update pages as needed

### Build for Production

```bash
npm run build
# or
yarn build
```

This will create optimized production files in the `dist` directory.

### Deploying to Netlify

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Add your environment variables in the Netlify dashboard

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and set up the build configuration
3. Add your environment variables in the Vercel dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Various AI providers
- [Supabase](https://supabase.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the UI framework

