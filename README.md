 # JS Engine Flow Visualizer

 JS Engine Flow Visualizer is an interactive web application that visually demonstrates the flow of JavaScript code execution, including the call stack, code editor, and console output. This tool is designed to help users understand how JavaScript executes code step-by-step, making it ideal for students, educators, and developers who want to deepen their understanding of JavaScript internals.

 ## Features

 - **Interactive Code Editor**: Write and edit JavaScript code directly in the browser.
 - **Call Stack Visualization**: See how function calls are pushed and popped from the call stack in real time.
 - **Console Output**: View console logs as your code executes.
 - **Web APIs**: Work in progress.
 - **Task/callback Queue**: Work in progress.
 - **Micro Task Queue**: Work in progress.
 - **Step-by-Step Execution**: Step through code execution to observe how the JavaScript engine processes each line.
 - **Modern UI**: Built with React and Vite for a fast and responsive experience.
 - **Reusable UI Components**: Modular and reusable components for easy extension.
 - **OOP & Observer Pattern**: The core logic leverages Object-Oriented Programming and the Observer Pattern to manage state and synchronize UI updates efficiently.

 ## Technologies Used

 - **React** (with TypeScript)
 - **Vite** (for fast development and build)
 - **Framer Motion** (for smooth animations)
 - **Custom CSS**

 ## Design & Architecture

 - **Object-Oriented Programming (OOP)**: The application's core logic is structured using OOP principles, making the codebase modular, maintainable, and extensible.
 - **Observer Pattern**: The Observer Pattern is used to decouple the state management from UI components. This allows components to react to state changes efficiently, ensuring a responsive and interactive user experience.

 ## Getting Started

 ### Prerequisites
 - Node.js (v16 or higher recommended)
 - Yarn or npm

 ### Installation

 1. Clone the repository:
   ```bash
   git clone https://github.com/sammyyOzz/javascript-engine-flow.git
   cd js-visualizer
   ```
 2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```
 3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```
 4. Open [http://localhost:5173](http://localhost:5173) in your browser.

 ## Project Structure

 ```
 js-engine-flow/
 ├── public/                # Static assets
 ├── src/
 │   ├── assets/            # Images and SVGs
 │   ├── components/        # React components (CallStack, CodeEditor, Console, Navbar, etc.)
 │   ├── constants/         # Static code samples
 │   ├── context/           # React context for global state
 │   ├── hooks/             # Custom React hooks
 │   ├── lib/               # Core logic (OOP, Observer Pattern, utilities)
 │   ├── types/             # TypeScript type definitions
 │   ├── App.tsx            # Main app component
 │   └── main.tsx           # Entry point
 ├── package.json
 ├── vite.config.ts
 └── README.md
 ```

 ## Usage

 - Write or paste JavaScript code in the editor.
 - Use the step controls to execute code line by line.
 - Observe the call stack and console output update in real time.

 ## Contributing

 Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

 ## License

 This project is licensed under the MIT License.

 ## Acknowledgements

 - Inspired by educational tools for visualizing code execution.
 - Built with the support of the open-source community.
