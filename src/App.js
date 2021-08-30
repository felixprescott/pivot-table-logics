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
      name: 'Metrics',
      cells: [],
    },
    rows: [],
    sum: {
      name: 'Sum',
      cells: []
    },
  };

  const datasetService = new DatasetService();
  const uniqueMetrics = datasetService.getUniqueMetrics();
  data.metrics.cells = uniqueMetrics;

  const uniqueMetricsList = uniqueMetrics.map((item) => {
    return (
      <>
        <input type="checkbox" />
        {item}
        <br/>
      </>
    );
  });

  const fields = datasetService.getFields();
  const fieldsList = fields.map((item) => {
    return (
      <>
        <input type="checkbox" />
        {item.ru}
        <br/>
      </>
    );
  });

  const field = "tb";
  const uniqueValues = datasetService.getUniqueValuesByField(field);
  for(let i=0; i<uniqueValues.length; i++) {
    const arrOfSumByMetric = uniqueMetrics.map(metric => datasetService.getSumForMetricByFieldAndFieldValue(metric, field, uniqueValues[i]));
    
    data.rows.push({
      name: uniqueValues[i],
      cells: arrOfSumByMetric
    })
  };

  console.log("Количество презентаций", "tb", "ТБ 9", datasetService.getSumForMetricByFieldAndFieldValue("Количество презентаций", "tb", "ТБ 9"));

  return (
    <>
      <SettingsUL>
        {uniqueMetricsList}
      </SettingsUL>

      <SettingsUL>
        {fieldsList}
      </SettingsUL>

      <PivotTable data={data} />
    </>
  );
}

export default App;
