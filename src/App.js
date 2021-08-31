import DatasetService from './services';
import PivotTable from './pivotTable';
import { useState, useEffect } from 'react';

const App = () => {

  const [metricNames, setMetricNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [data, setData] = useState({metrics:{name:'Fields',cells:[],},rows:[],sum:{name:'Сбербанк РФ',cells:[]}});

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
  
  useEffect(() => {

    const datasetService = new DatasetService();

    const uniqueMetrics = datasetService.getUniqueMetrics();
    setMetricNames(uniqueMetrics);

    const allFields = datasetService.getFieldNames();
    setFieldNames(allFields);

    const preparedData = {
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

    const rowsParams = datasetService.getUniqueValuesByFieldName(selectedFields[0]);
    
    for (let i=1;i<selectedFields.length;i++) {
      for (let j=0; j<rowsParams.length; j++) {
        if (rowsParams[j].length === i) {
          let values = datasetService.getUniqueValuesForFieldByFieldNamesAndFieldValues(selectedFields[i], rowsParams[j]);
          rowsParams.splice(j+1, 0, ...values);
          j += values.length;
        }
      }
    }

    preparedData.metrics.cells = metricNames.map(metric => metric.ru);
    
    for (let i=0; i<rowsParams.length; i++) {
      preparedData.rows.push({
        name: rowsParams[i][rowsParams[i].length-1].fieldValue,
        margin: rowsParams[i].length,
        cells: metricNames.map( metric => {
          return datasetService.getSumForMetricByFieldsAndFieldsValues(metric.ru, rowsParams[i]);
        })
      })
    }
    setData(preparedData);

  },[]);

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