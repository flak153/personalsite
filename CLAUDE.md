# Commands
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and automatically fix issues (including unescaped quotes)

# Code Style
- TypeScript with strict mode
- Two-space indentation, double quotes, semicolons
- React components: PascalCase (RootLayout, Home)
- Functions/variables: camelCase
- Use Readonly for props interfaces
- Import order: React → Next.js → external → local
- Type imports separate from value imports
- Tailwind CSS for styling
- Path alias: `@/*` maps to `./src/*`
- Functional components with explicitly typed props
- Self-closing JSX tags when appropriate

# Architecture
- Next.js App Router
- React Server Components