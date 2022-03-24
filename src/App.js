import DatasetService from './services';
import PivotTable from './pivotTable';
import { useState, useEffect, useMemo } from 'react';

const initData = {
  metrics:{
    name:'Поля',
    cells:[],
  },
  rows:[],
  sums:{
    name:'Итого',
    cells:[],
  },
};

const App = () => {
  const datasetService = useMemo(() => new DatasetService(), []);

  const [metricNames, setMetricNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [data, setData] = useState(initData);
  
  useEffect(() => {
    const uniqueMetrics = datasetService.getUniqueMetrics();
    setMetricNames(uniqueMetrics);

    const allFields = datasetService.getFieldNames();
    setFieldNames(allFields);
  }, [datasetService]);

  useEffect(() => {
    if (metricNames.length && fieldNames.length) {

      const selectedFields = fieldNames.filter( e => e.checked).map(e => e.en);
      const selectedMetrics = metricNames.filter( e => e.checked);
      
      const rowsParams = datasetService.getRowHeadersByFields(selectedFields);
  
      const preparedData = datasetService.getDataByMetricsAndRowHeaders(selectedMetrics , rowsParams);
      setData(preparedData);
    }
  }, [metricNames, fieldNames, datasetService]);

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
    <div>
      <h1 style={{textAlign: 'center'}}>Сводная таблица</h1>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div>
          <h3 style={{textAlign: 'center'}}>Столбцы</h3>
          <ul style={{maxWidth: '300px', margin: '10px', border: '1px solid gray', listStyleType: 'none', padding: '10px'}}>
            {metricNames.map( (item, index) => {
              return (
                <li key={item.ru}>
                  <button onClick={() => metricMoveUp(index)} disabled={index===0}>+</button>
                  <button onClick={() => metricMoveDown(index)} disabled={index>=metricNames.length-1}>–</button>
                  <input type="checkbox" checked={item.checked} onChange={() => metricToggle(item.ru)} />
                  {item.ru}
                </li>
              )
            })}
          </ul>
          <h3 style={{textAlign: 'center'}}>Строки</h3>
          <ul style={{maxWidth: '300px', margin: '10px', border: '1px solid gray', listStyleType: 'none', padding: '10px'}}>
            {fieldNames.map( (item, index) => {
              return (
                <li key={item.ru}>
                  <button onClick={() => fieldMoveUp(index)} disabled={index===0}>+</button> 
                  <button onClick={() => fieldMoveDown(index)} disabled={index>=fieldNames.length-1}>–</button>
                  <input type="checkbox" checked={item.checked} onChange={() => fieldToggle(item.ru)} />
                  {item.ru}
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <PivotTable data={data} selectedFields={fieldNames.filter(e => e.checked)}/>
        </div>
      </div>
    </div>
  );
  
}

export default App;