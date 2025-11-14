# AI Rules for Wedding Planner Application

This document outlines the technical stack and guidelines for developing features within the Wedding Planner application.

## Tech Stack

*   **React:** For building the user interface.
*   **TypeScript:** For type safety and improved code quality.
*   **Tailwind CSS:** For all styling and responsive design.
*   **date-fns:** For date manipulation and formatting.
*   **Recharts:** For creating charts and data visualizations.
*   **Lucide React:** For icons.
*   **Vite:** As the build tool and development server.
*   **shadcn/ui:** Pre-built, customizable UI components.

## Library Usage Rules

*   **React:** All UI components must be built using React functional components and hooks.
*   **TypeScript:** Always use TypeScript for new files and when modifying existing ones. Ensure proper typing for props, state, and functions.
*   **Tailwind CSS:** All styling must be done using Tailwind CSS utility classes. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, complex cases (which should be rare). Prioritize responsive design using Tailwind's responsive prefixes.
*   **date-fns:** Use `date-fns` for all date-related operations (formatting, calculations, comparisons). Do not use native `Date` object methods for complex logic.
*   **Recharts:** Use `Recharts` for any data visualization requirements, such as pie charts, bar charts, etc.
*   **Lucide React:** Use icons from the `lucide-react` library. If a specific icon is not available, consider using a generic one or discussing alternatives.
*   **shadcn/ui:** Leverage pre-built components from `shadcn/ui` whenever possible for common UI elements (e.g., buttons, cards, modals). Do not modify the `shadcn/ui` component files directly; if customization is needed beyond props, create a new component that wraps or extends the `shadcn/ui` component.
*   **File Structure:**
    *   New components should always be created in `src/components/` (or a relevant subfolder like `src/components/modals/`).
    *   New pages should be placed in `src/pages/`.
    *   Utility functions should go into `src/utils.ts`.
    *   Contexts and hooks should be in `src/context/` and `src/hooks/` respectively.
*   **Modals:** Use the existing modal structure and components (`src/components/modals/`) for any new modal requirements.
*   **Toasts:** Use the existing `Toast` component (`src/components/ui/Toast.tsx`) for user feedback.
*   **No Over-engineering:** Focus on implementing the requested features simply and elegantly. Avoid adding complex error handling, fallback mechanisms, or unnecessary abstractions unless explicitly requested.
*   **Completeness:** All implemented features must be fully functional with complete code; no placeholders or partial implementations.