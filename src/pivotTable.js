const PivotTable = ( {data} ) => {
  
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '80%',
    backgroundColor: 'gray',
    margin: '10px auto',
  };

  const t = {
    border: '1px solid black',
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <td style={t}>{data.metrics.name}</td>
          {data.metrics.cells.map( cell => <td style={t}>{cell}</td>)}
        </tr>
      </thead>
      <tbody>
        {data.rows.map( (row) => {
          return (
            <tr>
              <td style={{border: '1px solid black', paddingLeft: row.margin*20+'px'}}>
                <button>-</button>{row.name}
              </td>
              {row.cells.map( cell => <td style={t}>{cell}</td>)}
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <td style={t}>{data.sum.name}</td>
          {data.sum.cells.map( cell => <td style={t}>{cell}</td>)}
        </tr>
      </tfoot>
    </table>
  )
};

export default PivotTable;
