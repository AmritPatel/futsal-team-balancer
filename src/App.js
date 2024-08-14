import React, { useState } from 'react';
import PlayerTable from './PlayerTable';
import TeamDisplay from './TeamDisplay';
import './App.css';

function App() {
  const initialPlayers = [
    { name: "Mironel", position: "D", rating: 6 },
    { name: "Anish", position: "M", rating: 6 },
    { name: "Amrit", position: "E", rating: 9 },
    { name: "Anders", position: "E", rating: 9 },
    { name: "Saugat", position: "M", rating: 6 },
    { name: "Sujan", position: "E", rating: 9 },
    { name: "Tancho", position: "M", rating: 6 },
    { name: "Yoshi", position: "F", rating: 8 },
    { name: "Sandip", position: "E", rating: 6 },
    { name: "Adrian", position: "F", rating: 9 },
    { name: "Akki", position: "F", rating: 9 },
    { name: "Diwas", position: "E", rating: 6 },
    { name: "Rajesh", position: "E", rating: 7 },
    { name: "Mike", position: "F", rating: 7 },
    { name: "Pranab", position: "G", rating: 8 }
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [teams, setTeams] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const calculateTeams = () => {
    const shuffledPlayers = shuffleArray([...players]);
    const team1 = shuffledPlayers.slice(0, 5);
    const team2 = shuffledPlayers.slice(5, 10);
    const team3 = shuffledPlayers.slice(10, 15);
    setTeams([team1, team2, team3]);
  };

  return (
    <div className="App container">
      <h1>Futsal Team Balancer</h1>
      <p className="warning">⚠️ Toggle off the player rating and position before copying/pasting to the group chat!</p>
      <p className="info">Keep all player ratings the same to create random teams balanced only by natural position.</p>
      <PlayerTable players={players} setPlayers={setPlayers} />
      <button className="btn btn-primary mt-3" onClick={calculateTeams}>Recalculate Teams</button>
      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
        <label className="form-check-label">
          Show Position, Rating, Team Columns
        </label>
      </div>
      <TeamDisplay teams={teams} showDetails={showDetails} />
    </div>
  );
}

export default App;
