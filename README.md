# React Candy Crush Project Setup with Vite

This guide helps you set up a React project named **Candy Crush** using Vite, a fast build tool for modern web development.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Steps to Create the Project

1. **Initialize the Vite Project**

   ```bash
   npm create vite@latest candy-crush --template react
   ```

   This command creates a new React project using Vite with the name `candy-crush`.

2. **Navigate to the Project Directory**

   ```bash
   cd candy-crush
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and visit the URL shown in the terminal (e.g., `http://localhost:5173`).

## Additional Configuration

### 1. **Add Tailwind CSS (Optional)**

Tailwind CSS can help you quickly style your application.

- Install Tailwind CSS:

  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

- Configure `tailwind.config.js`:

  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```

- Add Tailwind directives to your `src/index.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 2. **Set up ESLint and Prettier**

To maintain code quality and formatting:

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

- Create an `.eslintrc.json` file:
  ```json
  {
    "extends": ["eslint:recommended", "plugin:react/recommended", "prettier"],
    "plugins": ["react"],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "env": {
      "browser": true,
      "es2021": true
    },
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {}
  }
  ```

## Folder Structure

Here’s the folder structure based on the project:

```
├── src
│   ├── components
│   │   └── Board.tsx
│   ├── hooks
│   │   └── useSound.ts
│   ├── utils
│   │   ├── gameLogic.ts
│   │   └── levels.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Build for Production

When ready to deploy:

```bash
npm run build
```

The output will be in the `dist` folder.

## Conclusion

Your Candy Crush project is now set up and ready for development! Customize it further to build your game.
