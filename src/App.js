import DatasetService from './services';
import PivotTable from './pivotTable';
import { useState, useEffect } from 'react';

const initData = {
  metrics:{
    name:'Fields',
    cells:[],
  },
  rows:[],
  sums:{
    name:'Сбербанк РФ',
    cells:[],
  },
};

const App = () => {
  const datasetService = new DatasetService();

  const [metricNames, setMetricNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [data, setData] = useState(initData);
  
  useEffect(() => {
    const uniqueMetrics = datasetService.getUniqueMetrics();
    setMetricNames(uniqueMetrics);

    const allFields = datasetService.getFieldNames();
    setFieldNames(allFields);
  },[]);

  useEffect(() => {
    //const selectedFields = ['channel_type','channel','presentation_system'];
    if (metricNames.length && fieldNames.length) {

      const selectedFields = fieldNames.filter( e => e.checked).map(e => e.en);
      const selectedMetrics = metricNames.filter( e => e.checked);
      
      const rowsParams = datasetService.getRowHeadersByFields(selectedFields);
  
      const preparedData = datasetService.getDataByMetricsAndRowHeaders(selectedMetrics , rowsParams);
      setData(preparedData);
    }
  },[metricNames, fieldNames]);

  const metricToggle = (metricName) => {
    const index = metricNames.findIndex( item => item.ru === metricName);
    const changedMetric = {...metricNames[index], checked: !metricNames[index].checked};
    setMetricNames([...metricNames.slice(0,index), changedMetric, ...metricNames.slice(index+1)]);
  };

  const metricMoveUp = (index) => {
    if (index>0) {
      const reorderedMetrics = [...metricNames.slice(0, index-1), metricNames[index], metricNames[index-1], ...metricNames.slice(index+1)];
      setMetricNames(reorderedMetrics);
    };
  };
  
  const metricMoveDown = (index) => {
    if (index<metricNames.length-1) {
      const reorderedMetrics = [...metricNames.slice(0, index), metricNames[index+1], metricNames[index], ...metricNames.slice(index+2)];
      setMetricNames(reorderedMetrics);
    };
  };
  
  const fieldToggle = (fieldName) => {
    const index = fieldNames.findIndex( item => item.ru === fieldName);
    const changedField = {...fieldNames[index], checked: !fieldNames[index].checked};
    setFieldNames([...fieldNames.slice(0,index), changedField, ...fieldNames.slice(index+1)]);
  };
    
  const fieldMoveUp = (index) => {
    if (index>0) {
      const reorderedFields = [...fieldNames.slice(0, index-1), fieldNames[index], fieldNames[index-1], ...fieldNames.slice(index+1)];
      setFieldNames(reorderedFields);
    };
  };
  
  const fieldMoveDown = (index) => {
    if (index<fieldNames.length-1) {
      const reorderedFields = [...fieldNames.slice(0, index), fieldNames[index+1], fieldNames[index], ...fieldNames.slice(index+2)];
      setFieldNames(reorderedFields);
    };
  };
  
  return (
    <>
      <ul style={{maxWidth: '300px', backgroundColor: 'aliceblue', margin: '10px auto', borderRadius: '10px', border: '1px solid gray'}}>
        {metricNames.map( (item, index) => {
          return (
            <li key={item.ru}>
              <button onClick={() => metricMoveUp(index)}>+</button>
              <button onClick={() => metricMoveDown(index)}>–</button>
              <input type="checkbox" checked={item.checked} onChange={() => metricToggle(item.ru)} />
              {item.ru}
            </li>
          )
        })}
      </ul>

      <ul style={{maxWidth: '300px', backgroundColor: 'aliceblue', margin: '10px auto', borderRadius: '10px', border: '1px solid gray'}}>
        {fieldNames.map( (item, index) => {
          return (
            <li key={item.ru}>
              <button onClick={() => fieldMoveUp(index)}>+</button> 
              <button onClick={() => fieldMoveDown(index)}>–</button>
              <input type="checkbox" checked={item.checked} onChange={() => fieldToggle(item.ru)} />
              {item.ru}
            </li>
          )
        })}
      </ul>

      <PivotTable data={data} selectedFields={fieldNames.filter(e => e.checked)}/>
    </>
  );
  
}

export default App;