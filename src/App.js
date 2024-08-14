import React, { useState } from 'react';
import PlayerTable from './PlayerTable';
import TeamDisplay from './TeamDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [numPlayers, setNumPlayers] = useState(10);
  const [numTeams, setNumTeams] = useState(3);
  const [players, setPlayers] = useState(Array.from({ length: 10 }, () => ({
    id: uuidv4(),
    name: '',
    position: 'E',
    rating: 5,
  })));
  const [previousPlayers, setPreviousPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentVariance, setCurrentVariance] = useState(Infinity);
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [canRandomize, setCanRandomize] = useState(true);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  const handleNumPlayersChange = (newNumPlayers) => {
    if (newNumPlayers > players.length) {
      const additionalPlayers = Array.from({ length: newNumPlayers - players.length }, () => ({
        id: uuidv4(),
        name: '',
        position: 'E',
        rating: 5,
      }));
      setPlayers((prevPlayers) => [...prevPlayers, ...additionalPlayers]);
    } else {
      setPlayers((prevPlayers) => prevPlayers.slice(0, newNumPlayers));
    }
    setNumPlayers(newNumPlayers);
  };

  const incrementPlayers = () => handleNumPlayersChange(numPlayers + 1);
  const decrementPlayers = () => handleNumPlayersChange(numPlayers > 1 ? numPlayers - 1 : 1);

  const toggleTableCollapse = () => setIsTableCollapsed(!isTableCollapsed);

  const calculateTeams = () => {
    if (players.length === 0) {
      setMessage('Please generate player data first.');
      return;
    }

    let bestTeams = generateInitialTeams();
    let bestVariance = calculateVariance(bestTeams);

    const initialTemperature = 100;
    const coolingRate = 0.995;
    let temperature = initialTemperature;

    while (temperature > 1) {
      const newTeams = swapPlayers(bestTeams);

      if (newTeams.every(checkPositionConstraints) && isHighRatedPlayerSpreadEven(newTeams)) {
        const newVariance = calculateVariance(newTeams);
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

  const resetOptimization = () => {
    setTeams([]);
    setCurrentVariance(Infinity);
    setMessage('');
  };

  const randomizeTeams = () => {
    if (canRandomize) {
      setPreviousPlayers(players);
      const randomizedPlayers = players.map(player => ({ ...player, rating: 5 }));
      setPlayers(randomizedPlayers);
      resetOptimization();
      setCanRandomize(false);
    }
  };

  const undoRandomTeams = () => {
    if (previousPlayers.length > 0) {
      setPlayers(previousPlayers);
      resetOptimization();
      setCanRandomize(true);
    }
  };

  const handlePlayerChange = (newPlayers) => {
    setPlayers(newPlayers);
    resetOptimization();
    setCanRandomize(true);
  };

  const toggleDescriptionCollapse = () => {
    setIsDescriptionCollapsed(!isDescriptionCollapsed);
  };

  const calculateAverageRating = (team) => {
    if (!team || team.length === 0) return 0;
    const totalRating = team.reduce((acc, player) => {
      const rating = parseFloat(player.rating);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);

    const average = totalRating / team.length;
    return isNaN(average) ? 0 : average;
  };

  const generateInitialTeams = () => {
    let shuffledPlayers = shuffleArray(players);
    const teamSize = Math.ceil(players.length / numTeams);

    const teams = [];
    for (let i = 0; i < numTeams; i++) {
      teams.push(shuffledPlayers.slice(i * teamSize, (i + 1) * teamSize));
    }

    return teams;
  };

  const shuffleArray = (array) => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
    }
    return clonedArray;
  };

  const calculateVariance = (teams) => {
    const averages = teams.map(calculateAverageRating);
    const meanRating = averages.reduce((acc, avg) => acc + avg, 0) / teams.length;
    return averages.reduce((acc, avg) => acc + Math.pow(avg - meanRating, 2), 0) / teams.length;
  };

  const swapPlayers = (teams) => {
    const teamIndex1 = Math.floor(Math.random() * teams.length);
    const teamIndex2 = (teamIndex1 + Math.floor(Math.random() * (teams.length - 1)) + 1) % teams.length;
    const playerIndex1 = Math.floor(Math.random() * teams[teamIndex1].length);
    const playerIndex2 = Math.floor(Math.random() * teams[teamIndex2].length);

    const newTeams = teams.map((team) => [...team]);
    [newTeams[teamIndex1][playerIndex1], newTeams[teamIndex2][playerIndex2]] =
      [newTeams[teamIndex2][playerIndex2], newTeams[teamIndex1][playerIndex1]];

    return newTeams;
  };

  const checkPositionConstraints = (team) => {
    const positions = team.map(player => player.position);
    const hasGorD = positions.some(pos => pos === 'G' || pos === 'D');
    const ECount = positions.filter(pos => pos === 'E').length;

    return hasGorD || ECount >= 2;
  };

  const isHighRatedPlayerSpreadEven = (teams) => {
    const highRatedCounts = teams.map(team =>
      team.filter(player => player.rating >= 8).length
    );
    const minCount = Math.min(...highRatedCounts);
    const maxCount = Math.max(...highRatedCounts);

    return (maxCount - minCount) <= 1;
  };

  return (
    <div className="App container">
      <h1>Futsal Team Balancer</h1>

      <p className="warning">
        ⚠️ Toggle off the player rating and position before copying/pasting to the group chat!
      </p>
      <p className="info">
        Keep all player ratings the same to create random teams balanced only by natural position.
      </p>

      <div className="mb-3">
        <button className="btn btn-info" onClick={toggleDescriptionCollapse}>
          {isDescriptionCollapsed ? "Show" : "Hide"} How This App Works
        </button>
        <div className={`collapse ${!isDescriptionCollapsed ? 'show' : ''}`}>
          <div className="mt-3">
            <h4>How This App Works</h4>
            <p>This app helps you balance futsal teams based on player ratings and positions.</p>
            <p>You can edit the player data in the table below, and then click 'Recalculate Teams' to distribute players into balanced teams.</p>
            <p>The app optimizes the teams to minimize the variance in average team ratings while ensuring that each team has a good mix of player positions.</p>
            <p>If a team doesn't have at least one natural goalkeeper (G) or defender (D), it will be ensured that the team has at least two 'E' (everything) players to maintain balance.</p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label>Number of Players:</label>
        <div className="input-group mb-3">
          <button className="btn btn-outline-secondary" onClick={decrementPlayers}>-</button>
          <input
            type="number"
            value={numPlayers}
            readOnly
            className="form-control"
          />
          <button className="btn btn-outline-secondary" onClick={incrementPlayers}>+</button>
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-secondary" onClick={toggleTableCollapse}>
          {isTableCollapsed ? "Show Player Input Table" : "Hide Player Input Table"}
        </button>
      </div>

      {!isTableCollapsed && (
        <PlayerTable players={players} setPlayers={handlePlayerChange} showDetails={true} />
      )}

      <div className="mb-3">
        <label htmlFor="numTeams">Number of Teams:</label>
        <input
          type="number"
          id="numTeams"
          value={numTeams}
          onChange={(e) => setNumTeams(parseInt(e.target.value, 10))}
          min="2"
          className="form-control"
        />
      </div>

      <div className="d-flex flex-wrap mt-3">
        <button className="btn btn-primary mr-2" onClick={calculateTeams}>
          Recalculate Teams
        </button>
        <button className="btn btn-secondary mr-2" onClick={resetOptimization}>
          Re-initialize Teams
        </button>
        <button className="btn btn-warning mr-2" onClick={randomizeTeams} disabled={!canRandomize}>
          Random Teams
        </button>
        <button className="btn btn-danger" onClick={undoRandomTeams}>
          Undo Random Teams
        </button>
      </div>

      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
        <label className="form-check-label">
          Show Position and Rating columns in output
        </label>
      </div>

      {message && (
        <p className="text-danger font-weight-bold mt-3">
          {message}
        </p>
      )}

      {teams.length > 0 && (
        <TeamDisplay teams={teams} showDetails={showDetails} calculateAverageRating={calculateAverageRating} />
      )}
    </div>
  );
}

export default App;
