# BGG Tool (Web)


## Project Structure
```
my-react-app
├── matchData.json
├── package.json
├── public
│   ├── configs/
│   │   ├── overwatch.json
│   │   └── valorant.json
│   ├── html/              // UI ELEMENTS
│   ├── index.html
│   └── uploads/
├── README.md
├── server.js
├── src
│   ├── App.js
│   ├── components/
│   │   ├── Match.js
│   │   ├── GenerateTeamSide.js
|   |   ├── Replay.js
|   |   ├── General.js
|   |   ├── Bracket.js
|   |   └
│   ├── index.js
│   └── styles/
│       └── App.css
```



## Features

- **Tab Navigation**: Switch between different functionalities using a navigation bar.
- **Input Fields**: Each tab contains 50 input fields for user inputs relevant to that tab.
- **Responsive Design**: Utilizes Bootstrap for a responsive layout.

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd my-react-app`
3. Install dependencies: `npm install`
4. Start the application: `npm start`
5. Start the Dev Server: `node ./src/server.js`
6. Navigate to `http://localhost:8080`

**Pages are now accessible as usual..**<br/>
Example: `http://localhost:8080/heroes1.html` 


## Dependencies
- Node.js
- React
- Bootstrap

## License

This project is licensed under the MIT License.