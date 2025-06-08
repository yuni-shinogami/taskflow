# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlowは、日々のタスク管理を効率化するWebアプリケーションです。優先度とカテゴリーによる整理で生産性を向上させ、シンプルなUIで直感的に操作できます。

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Storage**: LocalStorage / IndexedDB
- **Deployment**: Vercel

## Commands

```bash
npm install        # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint

# E2E Testing Commands
npm run test:e2e         # Run all e2e tests headlessly
npm run test:e2e:ui      # Open Playwright UI mode
npm run test:e2e:debug   # Run tests in debug mode
npm run test:e2e:headed  # Run tests with browser visible
npm run test:e2e:report  # Show HTML test report
```

## Project Structure

```
taskflow/
├── src/
│   ├── components/       # React components
│   │   ├── TaskList/
│   │   ├── TaskForm/
│   │   ├── TaskFilter/
│   │   ├── TaskStats/
│   │   └── common/
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── context/         # React Context for state management
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── docs/                # Documentation
│   └── specification.md # Project specification
└── package.json         # Project configuration
```

## Development Workflow

1. **Component Development**: Create components in `src/components/` with TypeScript
2. **State Management**: Use React Context API for global state
3. **Styling**: Use Tailwind CSS utility classes
4. **Type Safety**: Define interfaces in `src/types/`
5. **Testing**: Write tests alongside components (*.test.tsx)

## Key Features to Implement

1. **Task CRUD Operations**
   - Create tasks with title, description, priority, category, and due date
   - Edit existing tasks
   - Delete tasks
   - Toggle completion status

2. **Task Organization**
   - Priority levels (High/Medium/Low)
   - Categories (Work/Personal/Study/Other)
   - Due date management with overdue warnings

3. **Filtering and Sorting**
   - Filter by category
   - Sort by priority
   - Filter by completion status
   - Sort by due date

4. **Data Persistence**
   - Auto-save to LocalStorage
   - Export/Import functionality (JSON format)

## Code Guidelines

- Use functional components with hooks
- Implement proper TypeScript types for all props and state
- Follow React best practices for performance (useMemo, useCallback)
- Keep components small and focused
- Use semantic HTML and ensure accessibility

## Git Workflow

- Use conventional commits (feat:, fix:, docs:, etc.)
- Create feature branches for new functionality
- Keep commits atomic and well-described

## E2E Testing

The project includes comprehensive end-to-end tests using Playwright:

1. **Test Structure**:
   - `e2e/taskflow.spec.ts` - Core functionality tests
   - `e2e/performance.spec.ts` - Performance and efficiency tests
   - `e2e/accessibility.spec.ts` - Accessibility compliance tests
   - `e2e/advanced-scenarios.spec.ts` - Complex workflow tests

2. **Test Helpers**:
   - `e2e/helpers/task-helpers.ts` - Reusable functions for common operations

3. **CI Integration**:
   - Tests run automatically on push to main/develop branches
   - Test reports and screenshots are uploaded as artifacts

4. **Running Tests Locally**:
   ```bash
   npx playwright install  # First time setup
   npm run test:e2e       # Run all tests
   npm run test:e2e:ui    # Interactive UI mode
   ```