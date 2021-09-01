import { useState, useEffect } from 'react';

const PivotTable = ( {data, selectedFields} ) => {

  const initSettings = {};
  const [openSettings, setOpenSettings] = useState(initSettings);
  
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

  const makeKeyFromHeader = (rowHeader) => {
    return rowHeader.map(e=>e.fieldValue).join('/');
  }
  
  const switchFolderOpened = (key) => {
    const settings = {...openSettings}
    settings[key] = !openSettings[key];
    setOpenSettings(settings);
  };

  useEffect(() => {
    if(data.rows.length) {
      const settings = {};
      for (let i=0; i<data.rows.length; i++){
        if(data.rows[i].rowHeader.length<selectedFields.length) {
          settings[makeKeyFromHeader(data.rows[i].rowHeader)] = false;
        }
      }
      
      setOpenSettings(settings);
    }    
  },[data, selectedFields]);

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
          let isRowShowing = true;
          if (row.rowHeader.length>1) {
            for (let i=0; i<row.rowHeader.length-1; i++) {
              isRowShowing = isRowShowing && openSettings[makeKeyFromHeader(row.rowHeader.slice(0,i+1))];
            }
          } else {isRowShowing = true}
          if (isRowShowing)
            return (
              <tr>
                <td style={{border: '1px solid gray', backgroundColor: 'aliceblue', paddingLeft: row.margin*20+'px'}}>
                  {
                    (row.rowHeader.length<selectedFields.length) && 
                      <button onClick={() => switchFolderOpened(makeKeyFromHeader(row.rowHeader))}>
                        { (openSettings[makeKeyFromHeader(row.rowHeader)]) ? '–' : '+' }
                      </button>
                  }
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
