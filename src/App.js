import DatasetService from './services';
import PivotTable from './pivotTable';
import { useState, useEffect } from 'react';

const App = () => {
  const datasetService = new DatasetService();

  const [metricNames, setMetricNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [data, setData] = useState({metrics:{name:'Fields',cells:[],},rows:[],sum:{name:'Сбербанк РФ',cells:[]}});

  useEffect(() => {
    const uniqueMetrics = datasetService.getUniqueMetrics();
    setMetricNames(uniqueMetrics);

    const allFields = datasetService.getFieldNames();
    setFieldNames(allFields);

    const selectedFields = ['channel_type','channel','presentation_system'];
    const rowsParams = datasetService.getRowHeadersByFields(selectedFields);
    console.log(rowsParams);
    const preparedData = datasetService.getDataByMetricsAndRowHeaders(uniqueMetrics , rowsParams);
    setData(preparedData);
  },[]);

  const toggleMetric = (metricName) => {
    const index = metricNames.findIndex( item => item.ru === metricName);
    const changedMetric = {...metricNames[index], checked: !metricNames[index].checked};
    setMetricNames([...metricNames.slice(0,index), changedMetric, ...metricNames.slice(index+1)]);
  };
  
  const toggleField = (fieldName) => {
    const index = fieldNames.findIndex( item => item.ru === fieldName);
    const changedField = {...fieldNames[index], checked: !fieldNames[index].checked};
    setFieldNames([...fieldNames.slice(0,index), changedField, ...fieldNames.slice(index+1)]);
  };
  
  return (
    <>
      <ul style={{maxWidth: '300px', backgroundColor: 'gray', margin: '10px auto'}}>
        {metricNames.map( (item) => {
          return (
            <li key={item.ru}>
              <input type="checkbox" checked={item.checked} onChange={() => toggleMetric(item.ru)} />
              {item.ru}
              <br/>
            </li>
          )
        })}
      </ul>

      <ul style={{maxWidth: '300px', backgroundColor: 'gray', margin: '10px auto'}}>
        {fieldNames.map( (item) => {
          return (
            <li key={item.ru}>
              <input type="checkbox" checked={item.checked} onChange={() => toggleField(item.ru)} />
              {item.ru}
              <br/>
            </li>
          )
        })}
      </ul>

      <PivotTable data={data} />
    </>
  );
  
}

export default App;