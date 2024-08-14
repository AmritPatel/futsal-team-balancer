import React from 'react';

const TeamDisplay = ({ teams, showDetails, calculateAverageRating }) => {
  return (
    <div className="mt-3">
      {teams.map((team, index) => (
        <div key={index} className="mb-4">
          <h4>Team {index + 1} - Average Rating: {calculateAverageRating(team).toFixed(2)}</h4>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                {showDetails && <th>Position</th>}
                {showDetails && <th>Rating</th>}
              </tr>
            </thead>
            <tbody>
              {team.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  {showDetails && <td>{player.position}</td>}
                  {showDetails && <td>{player.rating}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TeamDisplay;
