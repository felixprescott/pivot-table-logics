const PivotTable = ( {data, selectedFields} ) => {
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '800px',
    backgroundColor: 'gray',
    margin: '10px auto',
  };

  const t = {
    border: '1px solid gray',
    backgroundColor: 'aliceblue',
  };
  
  const h = {
    border: '1px solid gray',
    backgroundColor: 'lavender',
    fontWeight: 'bold',
  };
  
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <td style={h}>{data.metrics.name}</td>
          {data.metrics.cells.map( cell => <td style={h}>{cell}</td>)}
        </tr>
      </thead>
      <tbody>
        {data.rows.map( (row) => {
          return (
            <tr>
              <td style={{border: '1px solid gray', backgroundColor: 'aliceblue', paddingLeft: row.margin*20+'px'}}>
                { (row.rowHeader.length<selectedFields.length) && <button>-</button>}
                {row.rowHeader[row.rowHeader.length-1].fieldValue}
              </td>
              {row.cells.map( cell => <td style={t}>{cell}</td>)}
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <td style={h}>{data.sums.name}</td>
          {data.sums.cells.map( cell => <td style={h}>{cell}</td>)}
        </tr>
      </tfoot>
    </table>
  )
};

export default PivotTable;
