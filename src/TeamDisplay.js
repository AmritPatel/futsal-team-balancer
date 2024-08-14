import React from 'react';

function TeamDisplay({ teams, showDetails, calculateAverageRating }) {
  const renderTeam = (team, teamIndex) => (
    <div key={teamIndex}>
      <h4>Team {teamIndex + 1}</h4>
      <p className="average-rating">Average Rating: {calculateAverageRating(team)}</p>
      <table className="table table-bordered">
        <tbody>
          {team.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              {showDetails && (
                <>
                  <td>{player.position}</td>
                  <td>{player.rating}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="team-display mt-4">
      {teams.length > 0 ? teams.map((team, index) => renderTeam(team, index)) : <p>No teams to display.</p>}
    </div>
  );
}

export default TeamDisplay;
