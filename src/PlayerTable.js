import React from 'react';
import { useTable } from 'react-table';

const PlayerTable = ({ players, setPlayers, showDetails }) => {

  const handleInputChange = (rowId, columnId, value) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === rowId ? { ...player, [columnId]: value } : player
      )
    );
  };

  const renderEditable = (cell) => {
    return (
      <input
        value={cell.value || ''}
        onChange={(e) => handleInputChange(cell.row.original.id, cell.column.id, e.target.value)}
        style={{ width: '100%' }}
      />
    );
  };

  const renderPositionDropdown = (cell) => {
    return (
      <select
        value={cell.value || 'E'}
        onChange={(e) => handleInputChange(cell.row.original.id, cell.column.id, e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="E">Everything (E)</option>
        <option value="D">Defender (D)</option>
        <option value="M">Midfielder (M)</option>
        <option value="F">Forward (F)</option>
        <option value="G">Goalkeeper (G)</option>
      </select>
    );
  };

  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: renderEditable,
      }
    ];

    if (showDetails) {
      baseColumns.push(
        {
          Header: 'Position',
          accessor: 'position',
          Cell: renderPositionDropdown,
        },
        {
          Header: 'Rating',
          accessor: 'rating',
          Cell: renderEditable,
        }
      );
    }

    return baseColumns;
  }, [showDetails]);

  const data = React.useMemo(() => players, [players]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className="table table-striped table-bordered">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PlayerTable;
