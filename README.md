# Spotify Clone

A modern music streaming application built with Next.js, React, and Supabase. This project replicates the core features of Spotify with a clean and intuitive user interface.

## Features

- **User Authentication**: Secure sign-up and login using Supabase authentication
- **Music Library**: Browse and explore a collection of songs
- **Search**: Search for songs by title or artist
- **Liked Songs**: Save your favorite songs to a personalized "Liked" playlist
- **User Account**: Manage your profile and view account details
- **Music Player**: Play songs with controls for play, pause, previous, and next
- **Song Upload**: Upload your own songs to the library
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) with React and TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: [Supabase](https://supabase.com)
- **State Management**: React Context API
- **Toast Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd spotify-clone
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
spotify-clone/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   └── (site)/          # Site pages
│       ├── page.tsx     # Home page
│       ├── search/      # Search page
│       ├── liked/       # Liked songs page
│       └── account/     # Account page
├── components/          # React components
│   ├── AuthModal.tsx
│   ├── Header.tsx
│   ├── Player.tsx
│   ├── Sidebar.tsx
│   ├── SongUpload.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useUser.tsx
│   └── useAuthModal.ts
├── providers/           # Context providers
│   ├── SupabaseProvider.tsx
│   ├── UserProvider.tsx
│   ├── PlayerProvider.tsx
│   └── ModalProvider.tsx
├── libs/                # Utility functions and clients
│   └── supabaseClient.ts
└── types/               # TypeScript type definitions
```

## Database Schema

The application uses the following Supabase tables:

- **users**: User profile information
- **songs**: Song metadata (title, artist, file_path)
- **liked_songs**: User's liked songs (user_id, song_id)

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production bundle
- `npm start`: Start the production server
- `npm run lint`: Run ESLint

## Features in Development

- Playlist creation and management
- Song recommendations
- User library sidebar enhancements
- Advanced audio controls

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is open source and available under the MIT License.
