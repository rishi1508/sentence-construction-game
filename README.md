# Sentence Construction Tool

A React-based interactive tool for sentence construction exercises.

## Features

- Interactive drag-and-drop sentence construction exercise
- Timer-based challenges to improve speed and accuracy
- Random question selection from a pool of exercises
- Mobile-responsive design for practice on any device
- Dark/Light mode toggle for comfortable viewing
- Score tracking and results analysis

## Technologies Used

- React 18 with TypeScript
- Chakra UI for responsive, accessible components
- Framer Motion for smooth animations
- Zustand for simple state management
- React Icons for modern UI elements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```
git clone https://github.com/rishi1508/sentence-construction-tool.git
cd sentence-construction-tool
```

2. Install dependencies

```
npm install
# or
yarn install
```

3. Start the development server

```
npm run dev
# or
yarn dev
```

4. Start the JSON server (in a separate terminal)

```
npm run server
# or
yarn server
```

5. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Click on the "Play" button to start a new game
2. Read the sentence with blanks
3. Click on the words from the options to fill in the blanks in the correct order
4. Complete all the blanks before the timer runs out
5. Move to the next question or view your results when finished

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # React components
├── services/      # API services
├── store/         # State management
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Development Notes

- The application uses a local JSON server to simulate a backend
- Questions are randomly selected from the sample.json file
- The timer is set to 30 seconds per question

## Future Improvements

- Add different difficulty levels
- Implement user accounts to track progress
- Add more question types (multiple choice, rearrangement, etc.)
- Include grammar explanations for incorrect answers

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or have found bugs.

## License

MIT

## Author

Rishi Mishra

## Deployment to Vercel

This project is deployed to Vercel. To visit:

https://sentence-construction-tool-rishi-mishras-projects.vercel.app/

\

### Manual Deployment

If you prefer to deploy manually:

1. Install Vercel CLI:

   ```
   npm i -g vercel
   ```

2. Log in to Vercel:

   ```
   vercel login
   ```

3. Deploy from your local directory:

   ```
   vercel
   ```

4. To deploy to production:
   ```
   vercel --prod
   ```
