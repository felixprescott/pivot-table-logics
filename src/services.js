import { dataset } from './dataset';

export default class DatasetService {
  
  getFieldNames = () => {
    
    return [
      {ru: 'ТБ', en: 'tb', checked: false},
      {ru: 'ГОСБ', en: 'gosb', checked: false},
      {ru: 'Регион', en: 'region', checked: false},
      {ru: 'Канал продаж', en: 'channel', checked: false},
      {ru: 'Тип канала продаж', en: 'channel_type', checked: false},
      {ru: 'Продающая роль', en: 'salling_role', checked: true},
      {ru: 'Система презентации', en: 'presentation_system', checked: false},
      {ru: 'Группа продуктов', en: 'dash_product', checked: false},
      {ru: 'Продуктовое предложение', en: 'product_offer', checked: true}
    ];
  }

  getUniqueMetrics = () => {
    const uniqueMetrics = new Set();
    for (let i=0; i<dataset.length; i++) {
      uniqueMetrics.add(dataset[i].metric)
    }
    return Array.from(uniqueMetrics).map(metric => ({ru: metric, checked: true}));
  }

  getUniqueValuesByFieldName = (fieldName) => {
    const uniqueValues = new Set();
    for (let i=0; i<dataset.length; i++) {
      uniqueValues.add(dataset[i][fieldName]);
    }
    return Array.from(uniqueValues).map( item => ([{fieldName: fieldName, fieldValue: item}]) );
  }

  getUniqueValuesForFieldByFieldNamesAndFieldValues = (fieldName, arrayOfFieldNamesAndFieldsValues) => {
    // например ('region', [{fieldName: 'tb',fieldValue: 'ТБ 1'}, {fieldName: 'gosb',fieldValue: 'ГОСБ 1'}])

    let uniqueValues = new Set();
    for (let i=0; i<dataset.length; i++) {
      const item = dataset[i];
      const itemMatchParams = arrayOfFieldNamesAndFieldsValues.reduce( (matching, condition) => {
        return (item[condition.fieldName] === condition.fieldValue) && matching
      }, true);

      if (itemMatchParams) {
        uniqueValues.add(item[fieldName]);
      };
    }

    const result = Array.from(uniqueValues).map( item => {
      return [...arrayOfFieldNamesAndFieldsValues, {fieldName: fieldName, fieldValue: item}]
    });
    return result;
  }

  getSumForMetricByFieldAndFieldValue = (metricValue, fieldName, fieldValue) => {
    let sum = 0;
    dataset.map( (item) => {
      if (item.metric === metricValue && item[fieldName] === fieldValue) {
        sum += parseFloat(item.value) ;
      };
      return null;
    });
    return sum;
  }

  getSumForMetricByFieldsAndFieldsValues = (metricName , arrayOfFieldsAndFieldsValues) => {
    // например ('Количество продаж', [{field: 'tb',fieldValue: 'ТБ 1'}, {field: 'gosb',fieldValue: 'ГОСБ 1'}])
    
    const result = dataset.reduce( (sum, item) => {
        if (item.metric === metricName) {

          const filedsMatch = arrayOfFieldsAndFieldsValues.reduce( (matching, condition) => {
            return (item[condition.fieldName] === condition.fieldValue) && matching
          }, true);

          if (filedsMatch) {
            return sum += item.value;
          };

        }
      return sum;
    }, 0);
    return result;
  }

  getRowsParamsBySelectedFields = (arrayOfFieldNames) => {
    return arrayOfFieldNames;
  }
  
};
