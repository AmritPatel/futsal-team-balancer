import React from 'react';

function PlayerTable({ players, setPlayers }) {
  const handleInputChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = field === 'rating' ? parseInt(value, 10) : value;
    setPlayers(updatedPlayers);
  };

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Player</th>
          <th>Position</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index}>
            <td><input
              type="text"
              value={player.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              className="form-control"
            /></td>
            <td><input
              type="text"
              value={player.position}
              onChange={(e) => handleInputChange(index, 'position', e.target.value)}
              className="form-control"
            /></td>
            <td><input
              type="number"
              value={player.rating}
              onChange={(e) => handleInputChange(index, 'rating', e.target.value)}
              className="form-control"
            /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlayerTable;
