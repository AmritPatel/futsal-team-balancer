import React, { useState } from 'react';
import PlayerTable from './PlayerTable';
import TeamDisplay from './TeamDisplay';
import './App.css';

function App() {
  const initialPlayers = [
    { name: "Mironel", position: "D", rating: 5 },
    { name: "Anish", position: "M", rating: 5 },
    { name: "Amrit", position: "E", rating: 5 },
    { name: "Anders", position: "E", rating: 5 },
    { name: "Saugat", position: "M", rating: 5 },
    { name: "Sujan", position: "E", rating: 5 },
    { name: "Tancho", position: "M", rating: 5 },
    { name: "Yoshi", position: "F", rating: 5 },
    { name: "Sandip", position: "E", rating: 5 },
    { name: "Adrian", position: "F", rating: 5 },
    { name: "Akki", position: "F", rating: 5 },
    { name: "Diwas", position: "E", rating: 5 },
    { name: "Rajesh", position: "E", rating: 5 },
    { name: "Mike", position: "F", rating: 5 },
    { name: "Pranab", position: "G", rating: 5 }
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

  const calculateAverageRating = (team) => {
    const totalRating = team.reduce((acc, player) => acc + player.rating, 0);
    return (totalRating / team.length).toFixed(2);
  };

  return (
    <div className="App container">
      <h1>Futsal Team Balancer</h1>
      <p className="warning">⚠️ Toggle off the player rating and position before copying/pasting to the group chat!</p>
      <p className="info">Keep all player ratings the same to create random teams balanced only by natural position.</p>

      <div className="description">
        <h4>How This App Works</h4>
        <p>This app helps you balance futsal teams based on player ratings and positions.</p>
        <p>You can edit the player data in the table below, and then click 'Recalculate Teams' to distribute players into balanced teams.</p>
        <p>The app optimizes the teams to minimize the variance in average team ratings while ensuring that each team has a good mix of player positions.</p>
        <p>If a team doesn't have at least one goalkeeper (G) or defender (D), it will be ensured that the team has at least two 'E' (everything) players to maintain balance.</p>
				<p>The only other position type allowed is forward (F).</p>
      </div>

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

      <TeamDisplay teams={teams} showDetails={showDetails} calculateAverageRating={calculateAverageRating} />
    </div>
  );
}

export default App;
