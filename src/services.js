import { dataset } from './dataset';

export default class DatasetService {
  
  getFieldNames = () => {
    
    return [
      {ru: 'ТБ', en: 'tb'},
      {ru: 'ГОСБ', en: 'gosb'},
      {ru: 'Регион', en: 'region'},
      {ru: 'Канал продаж', en: 'channel'},
      {ru: 'Тип канала продаж', en: 'channel_type'},
      {ru: 'Продающая роль', en: 'salling_role'},
      {ru: 'Система презентации', en: 'presentation_system'},
      {ru: 'Группа продуктов', en: 'dash_product'},
      {ru: 'Продуктовое предложение', en: 'product_offer'}
    ];
  }

  getUniqueMetrics = () => {
    const uniqueMetrics = new Set();
    dataset.map( (item) => {uniqueMetrics.add(item.metric); return null;} );
    return Array.from(uniqueMetrics);
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
