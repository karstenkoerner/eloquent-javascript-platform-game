# Platform Game — Eloquent JavaScript

This project is my implementation of the Platform Game exercise from Eloquent JavaScript by Marijn Haverbeke.

Having previously completed the Robot and Egg projects, I'm using each successive project to introduce additional software engineering concepts, tools, and professional development practices.

For this project, I'm experimenting with an AI-assisted development workflow designed to simulate aspects of a professional software engineering environment.

Frontier AI models, including ChatGPT and Claude, serve as simulated senior engineers and technical leads. Their responsibilities include:

- Project planning: Producing documentation such as a Product Requirements Document (PRD), technical design, and development roadmap.

- Task management: Breaking requirements into actionable engineering tickets with clearly defined acceptance criteria.

- Code review: Reviewing my pull requests for correctness, maintainability, and adherence to project requirements.

- Technical guidance: Providing architectural feedback, identifying potential issues, and explaining engineering concepts when necessary.

I remain responsible for implementing the application, writing and testing the code, and addressing review feedback. The goal is to develop both my programming abilities and my familiarity with the tools, processes, and expectations of professional software development.

Project planning and technical documentation are available in the docs/ directory.

### Running the Project

### Prerequisites

- Node.js and npm installed (npm comes with Node by default).
- Git

### Installation

Clone the repository and navigate into the root project directory:

```bash
git clone https://github.com/karstenkoerner/eloquent-javascript-platform-game.git
cd eloquent-javascript-platform-game
```

Install the project dependencies:

```bash
npm install
```

### Starting the Development Server

Start the local development server:

```bash
npm run dev
```

Once the server is running, open the following URLs in your browser:

- Game: http://localhost:8080
- Test Suite: http://localhost:8080/tests/

The test suite runs automatically when its page loads. Click Run Tests to execute the tests again.

To stop the development server, press Ctrl+C in the terminal.

## Code Quality

Run ESLint to check the project's JavaScript code:

```bash
npm run lint
```
