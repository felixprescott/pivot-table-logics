import './App.css';
import DatasetService from './services';
import styled from 'styled-components';
import PivotTable from './pivotTable';

const SettingsUL = styled.div`
  max-width: 300px;
  background-color: gray;
  margin: 10px auto;
`

function App() {

  const data = {
    metrics: {
      name: 'Selected fields',
      cells: [],
    },
    rows: [],
    sum: {
      name: 'Сбербанк РФ',
      cells: []
    },
  };

  const selectedFields = [
    'channel_type',
    'channel',
    'presentation_system'
  ];

  const datasetService = new DatasetService();

  const rowsParams = datasetService.getUniqueValuesByFieldName(selectedFields[0]);
  
  for (let i=1;i<selectedFields.length;i++) {
    let fieldName = selectedFields[i];
    for (let j=0; j<rowsParams.length; j++) {

      let params = rowsParams[j];
      if (params.length === i) {
        let values = datasetService.getUniqueValuesForFieldByFieldNamesAndFieldValues(fieldName, params);
        rowsParams.splice(j+1, 0, ...values);
        j += values.length;
      }
    }
  }

  console.log(rowsParams)

  const uniqueMetrics = datasetService.getUniqueMetrics();
  data.metrics.cells = uniqueMetrics;

  for (let i=0; i<rowsParams.length; i++) {
    data.rows.push({
      name: rowsParams[i][rowsParams[i].length-1].fieldValue,
      margin: rowsParams[i].length,
      cells: uniqueMetrics.map( metric => {
        return datasetService.getSumForMetricByFieldsAndFieldsValues(metric, rowsParams[i]);
      })
    })
  }
  
  const uniqueMetricsList = uniqueMetrics.map((item) => {
    return (
      <>
        <input type="checkbox" />
        {item}
        <br/>
      </>
    );
  });

  const fieldNames = datasetService.getFieldNames();
  const fieldNamesList = fieldNames.map((item) => {
    return (
      <>
        <input type="checkbox" />
        {item.ru}
        <br/>
      </>
    );
  });

  return (
    <>
      <SettingsUL>
        {uniqueMetricsList}
      </SettingsUL>

      <SettingsUL>
        {fieldNamesList}
      </SettingsUL>

      <PivotTable data={data} />
    </>
  );
}

export default App;
