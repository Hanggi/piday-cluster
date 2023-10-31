## Getting Started

First, run the development server:

```bash
yarn dev

bun dev
```

## Next.js project convention

We use App Router in this project. So, we have to follow the convention of Next.js.

### Project organization strategy

Split project files by feature or route.

[Project organization](https://nextjs.org/docs/app/building-your-application/routing/colocation#split-project-files-by-feature-or-route)

and use private folders for page sub components and lib.

[Private folder](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)

Example:

Suppose there is a post page now. This page consists of Sections 1 to 3.

```
./src
├─ components
├─ app
│   ├─ post                           <-- /post (Feature level)
│   │   ├─ _components                <-- Private folder
│   │   │   ├─ Section1.tsx
│   │   │   ├─ Section2.tsx
│   │   │   └─ section3
│   │   │       ├─ SubSection3-1.tsx
│   │   │       └─ SubSection3-2.tsx
│   │   ├─ _lib                       <-- Private folder
│   │   │    ├─ tool1.ts
│   │   │    └─ tool2.ts
│   │   ├─ layout.tsx
│   │   └─ page.tsx
│   ├─ layout.tsx
│   └─ page.tsx
├─ lib
...
```

- **\_components:** is a private folder that contains components that are only used in the post page.
- **\_lib:** is a private folder that contains libraries that are only used in the post page.
- **src/components:** is a public folder that contains components that are used in multiple pages.
- **src/lib:** is a public folder that contains libraries that are used in multiple pages.

## Conventions

- Use `yarn` as package manager
- Do not use personal dependencies or libraries that are infrequently used and not maintained by anyone

### Components:

- Use Pascal Case as react component naming convention. e.g: UserProfile.tsx
- When directory name is multiple words, use dash(-) as separator. e.g: user-profile
- Each component file should only contains one exported component.

### State management:

- Use Redux Toolkit for state management.
- Use Redux Toolkit's slice should be used as feature level. e.g: userSlice.ts

### Styles:

- Use Tailwind CSS for styling.

### Icons:

Currently, `Remix Icon` is recommended as icon library.

https://remixicon.com/

The package size of `react-icons`` is too large. So, we should not use it.

https://mui.com/joy-ui/integrations/icon-libraries/#third-party-icons
