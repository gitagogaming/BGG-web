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
2. Navigate to the project directory: `cd BGG-web`
3. Install dependencies: `npm install`
4. Start the Dev Server: `node ./server.js`
5. Start the application: `npm start`
6. Navigate to `http://localhost:8080`

**Pages are now accessible as usual..**<br/>
Completed Pages: 
`http://localhost:8080/duorow.html`
`http://localhost:8080/heroes1.html` 
`http://localhost:8080/heroes2.html` 
`http://localhost:8080/analystspecial.html` 



## Dependencies
- Node.js
- React
- Bootstrap






---

### values that need generated on GENERAL TAB by default.. absolutely mandatory for the basics to work.. 

Caster1
Caster2
BGG-Branding
