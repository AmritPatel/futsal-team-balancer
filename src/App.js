import React, { useState } from 'react';
import PlayerTable from './PlayerTable';
import TeamDisplay from './TeamDisplay';
import 'bootstrap/dist/css/bootstrap.min.css'; // Switch back to the standard Bootstrap theme
import './App.css';

function App() {
  const initialPlayers = [
    { name: "Mironel", position: "E", rating: 5 },
    { name: "Anish", position: "E", rating: 5 },
    { name: "Amrit", position: "E", rating: 5 },
    { name: "Anders", position: "E", rating: 5 },
    { name: "Saugat", position: "E", rating: 5 },
    { name: "Sujan", position: "E", rating: 5 },
    { name: "Tancho", position: "E", rating: 5 },
    { name: "Yoshi", position: "E", rating: 5 },
    { name: "Sandip", position: "E", rating: 5 },
    { name: "Adrian", position: "E", rating: 5 },
    { name: "Akki", position: "E", rating: 5 },
    { name: "Diwas", position: "E", rating: 5 },
    { name: "Rajesh", position: "E", rating: 5 },
    { name: "Mike", position: "E", rating: 5 },
    { name: "Pranab", position: "E", rating: 5 }
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [teams, setTeams] = useState([]);
  const [previousPlayers, setPreviousPlayers] = useState([]); // To store previous state before "Random Teams"
  const [currentVariance, setCurrentVariance] = useState(Infinity);
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);  // Define state for showing details
  const [isCollapsed, setIsCollapsed] = useState(true); // State for "How This App Works" collapsible section
  const [isTableCollapsed, setIsTableCollapsed] = useState(false); // State for input table collapsible section

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleTableCollapse = () => setIsTableCollapsed(!isTableCollapsed);

  const shuffleArray = (array) => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
    }
    return clonedArray;
  };

  const checkPositionConstraints = (team) => {
    const positions = team.map(player => player.position);
    const hasGorD = positions.some(pos => pos === 'G' || pos === 'D');
    const ECount = positions.filter(pos => pos === 'E').length;

    return hasGorD || ECount >= 2;
  };

  const calculateAverageRating = (team) => {
    const totalRating = team.reduce((acc, player) => acc + player.rating, 0);
    return totalRating / team.length;
  };

  const calculateVariance = (team1, team2, team3) => {
    const avg1 = calculateAverageRating(team1);
    const avg2 = calculateAverageRating(team2);
    const avg3 = calculateAverageRating(team3);
    const meanRating = (avg1 + avg2 + avg3) / 3;
    return [avg1, avg2, avg3].reduce((acc, avg) => acc + Math.pow(avg - meanRating, 2), 0) / 3;
  };

  const swapPlayers = (teams) => {
    const teamIndex1 = Math.floor(Math.random() * 3);
    const teamIndex2 = (teamIndex1 + Math.floor(Math.random() * 2) + 1) % 3;
    const playerIndex1 = Math.floor(Math.random() * teams[teamIndex1].length);
    const playerIndex2 = Math.floor(Math.random() * teams[teamIndex2].length);

    const newTeams = teams.map((team, i) => [...team]);
    [newTeams[teamIndex1][playerIndex1], newTeams[teamIndex2][playerIndex2]] =
      [newTeams[teamIndex2][playerIndex2], newTeams[teamIndex1][playerIndex1]];

    return newTeams;
  };

  const generateInitialTeams = () => {
    let shuffledPlayers = shuffleArray(players);

    const highRatingPlayers = shuffledPlayers.filter(player => player.rating >= 8);
    const otherPlayers = shuffledPlayers.filter(player => player.rating < 8);

    const team1 = [
      ...highRatingPlayers.slice(0, Math.ceil(highRatingPlayers.length / 3)),
      ...otherPlayers.slice(0, 5 - Math.ceil(highRatingPlayers.length / 3))
    ];

    const team2 = [
      ...highRatingPlayers.slice(Math.ceil(highRatingPlayers.length / 3), 2 * Math.ceil(highRatingPlayers.length / 3)),
      ...otherPlayers.slice(5 - Math.ceil(highRatingPlayers.length / 3), 10 - 2 * Math.ceil(highRatingPlayers.length / 3))
    ];

    const team3 = [
      ...highRatingPlayers.slice(2 * Math.ceil(highRatingPlayers.length / 3)),
      ...otherPlayers.slice(10 - 2 * Math.ceil(highRatingPlayers.length / 3), 15 - highRatingPlayers.length)
    ];

    return [team1, team2, team3];
  };

  const resetOptimization = () => {
    setTeams([]);
    setCurrentVariance(Infinity);
    setMessage('');
  };

  const handlePlayerChange = (newPlayers) => {
    setPlayers(newPlayers);
    resetOptimization();
  };

  const randomizeTeams = () => {
    setPreviousPlayers(players); // Save the current state before randomizing
    const randomizedPlayers = players.map(player => ({ ...player, rating: 5 }));
    setPlayers(randomizedPlayers);
    resetOptimization();
  };

  const undoRandomTeams = () => {
    if (previousPlayers.length > 0) {
      setPlayers(previousPlayers); // Revert to the previous state
      resetOptimization();
    }
  };

  const calculateTeams = () => {
    let [team1, team2, team3] = generateInitialTeams();

    let bestTeams = [team1, team2, team3];
    let bestVariance = calculateVariance(team1, team2, team3);

    const initialTemperature = 100;
    const coolingRate = 0.995;
    let temperature = initialTemperature;

    while (temperature > 1) {
      const newTeams = swapPlayers(bestTeams);
      const [newTeam1, newTeam2, newTeam3] = newTeams;

      if (
        checkPositionConstraints(newTeam1) &&
        checkPositionConstraints(newTeam2) &&
        checkPositionConstraints(newTeam3)
      ) {
        const newVariance = calculateVariance(newTeam1, newTeam2, newTeam3);
        const delta = newVariance - bestVariance;

        if (delta < 0 || Math.exp(-delta / temperature) > Math.random()) {
          bestTeams = newTeams;
          bestVariance = newVariance;
        }
      }

      temperature *= coolingRate;
    }

    if (bestVariance <= currentVariance) {
      setTeams(bestTeams);
      setCurrentVariance(bestVariance);
      setMessage('');
    } else {
      setMessage('Table not updated due to increase in average team rating variance.');
    }
  };

  return (
    <div className="App container">
      <h1>Futsal Team Balancer</h1>
      <p className="warning">⚠️ Toggle off the player rating and position before copying/pasting to the group chat!</p>
      <p className="info">Keep all player ratings the same to create random teams balanced only by natural position.</p>

      <div className="mb-3">
        <button className="btn btn-info" onClick={toggleCollapse}>
          {isCollapsed ? "Show" : "Hide"} How This App Works
        </button>
        <div className={`collapse ${!isCollapsed ? 'show' : ''}`}>
          <div className="mt-3">
            <h4>How This App Works</h4>
            <p>This app helps you balance futsal teams based on player ratings and positions.</p>
            <p>You can edit the player data in the table below, and then click 'Recalculate Teams' to distribute players into balanced teams.</p>
            <p>The app optimizes the teams to minimize the variance in average team ratings while ensuring that each team has a good mix of player positions.</p>
            <p>If a team doesn't have at least one natural goalkeeper (G) or defender (D), it will be ensured that the team has at least two 'E' (everything) players to maintain balance.</p>
            <p>The only other allowable position type is forward (F).</p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-info" onClick={toggleTableCollapse}>
          {isTableCollapsed ? "Show" : "Hide"} Player Information Table
        </button>
        <div className={`collapse ${!isTableCollapsed ? 'show' : ''}`}>
          <PlayerTable players={players} setPlayers={handlePlayerChange} />
        </div>
      </div>

      <div className="d-flex flex-wrap mt-3">
        <button className="btn btn-primary mr-2" onClick={calculateTeams}>Recalculate Teams</button>
        <button className="btn btn-secondary mr-2" onClick={resetOptimization}>Re-initialize Teams</button>
        <button className="btn btn-warning mr-2" onClick={randomizeTeams}>Random Teams</button>
        <button className="btn btn-danger" onClick={undoRandomTeams}>Undo Random Teams</button>
      </div>
      {message && <p className="text-danger font-weight-bold mt-3" style={{ fontWeight: 'bold', color: 'red' }}>{message}</p>}
      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
        <label className="form-check-label">
          Show Position and Rating Columns
        </label>
      </div>

      <TeamDisplay
        teams={teams}
        showDetails={showDetails}
        calculateAverageRating={calculateAverageRating}
      />
    </div>
  );
}

export default App;
