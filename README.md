# DAPM Pipeline Editor

This project is a web application designed for creating and managing pipeline flows. It utilizes React for the frontend, Redux for state management, and React Flow for visualizing pipeline flows.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/pipeline-grid-project.git
```

2. Install the necessary packages:

```bash
npm install
```

3. Running the Application
To start the application in development mode, run:

```bash
npm start
```

This will launch the application in your default web browser. The application will automatically reload if you make any changes to the source files.

4. Building for Production
To build the application for production, run:

```bash
npm run build
```

This command will bundle React in production mode and optimize the build for the best performance. The build artifacts will be stored in the build/ directory.

### Usage

To be able to use it the computer has to be connected to DTU Compute's VPN.

### Changelog

#### Release 1

1. Core functionality
    - The user is now able to add Pipeline definitions using the frontend without exectuing them, the database will store these definitions
    - The Pipeline defintions can be retrieved by the members of the ortganizations they belong to and they can be opened on the frontend
    - Added delete resources option on sidebar

2. Access control
    - Added login form and enforced authentication for all users
    - Created user creation form for 'admin' role users
  



### Release 2 (15-11-2024)

#### Access control
- Added admin dashboard for user management
- Implemented user role assignment
- Implemented user deletion

#### Core functionality
- Added pipeline editing workflow
- Store pipeline executions persistently
- Implemented pipeline deletion workflow
