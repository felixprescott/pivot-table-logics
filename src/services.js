import { dataset } from './dataset';

export default class DatasetService {
  
  getFieldNames = () => {
    /*
      Какие ещё есть фильтры выше:
      - тип периода period_type = месяц
      - дата report_dt = последняя доступная
      + группа продуктов dash_product = если несколько то рандомный
      + продукт product_offer = все
      + канал channel = все
      + способ продажи presentation_system = все

      - количество периодов
      - параметры сплита
    */
    return [
      {ru: 'ТБ', en: 'tb', checked: false},
      {ru: 'ГОСБ', en: 'gosb', checked: false},
      {ru: 'Регион', en: 'region', checked: false},
      {ru: 'Канал продаж', en: 'channel', checked: true},
      {ru: 'Тип канала продаж', en: 'channel_type', checked: true},
      {ru: 'Продающая роль', en: 'salling_role', checked: false},
      {ru: 'Система презентации', en: 'presentation_system', checked: true},
      {ru: 'Группа продуктов', en: 'dash_product', checked: false},
      {ru: 'Продуктовое предложение', en: 'product_offer', checked: false}
    ];
  }

  getUniqueMetrics = () => {
    const uniqueMetrics = new Set();
    for (let i=0; i<dataset.length; i++) {
      uniqueMetrics.add(dataset[i].metric)
    };
    return Array.from(uniqueMetrics).map(metric => ({ru: metric, checked: true}));
  }

  getUniqueValuesByFieldName = (fieldName) => {
    const uniqueValues = new Set();
    for (let i=0; i<dataset.length; i++) {
      uniqueValues.add(dataset[i][fieldName]);
    };
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
    };

    const result = Array.from(uniqueValues).map( item => {
      return [...arrayOfFieldNamesAndFieldsValues, {fieldName: fieldName, fieldValue: item}]
    });
    return result;
  }

  getRowHeadersByFields = (arrayOfFieldNames) => {
    const result = this.getUniqueValuesByFieldName(arrayOfFieldNames[0]);

    for (let i=1;i<arrayOfFieldNames.length;i++) {
      for (let j=0; j<result.length; j++) {
        if (result[j].length === i) {
          let values = this.getUniqueValuesForFieldByFieldNamesAndFieldValues(arrayOfFieldNames[i], result[j]);
          result.splice(j+1, 0, ...values);
          j += values.length;
        };
      };
    };

    return result;
  }

  getSumForMetricByFieldsAndFieldsValues = (metricName , arrayOfFieldsAndFieldsValues) => {
    // например ('Количество продаж', [{field: 'tb',fieldValue: 'ТБ 1'}, {field: 'gosb',fieldValue: 'ГОСБ 1'}])
    const result = dataset.reduce( (sum, item) => {
        if (item.metric === metricName) {
          const filedsMatch = arrayOfFieldsAndFieldsValues.reduce( (matching, condition) => {
            return (item[condition.fieldName] === condition.fieldValue) && matching
          }, true);

          if (filedsMatch) {
            return (metricName === 'Конверсия') ? sum = (sum+item.value)/2 : sum += item.value;
          };
        }
      return sum;
    }, 0);
    return (metricName === 'Конверсия') ? result.toFixed(2)+'%' : result;
  }

  getDataByMetricsAndRowHeaders = (metrics, rowHeaders) => {
    const data = {
      metrics: {
        name: 'Selected fields',
        cells: [],
      },
      rows: [],
      sums: {
        name: 'Сбербанк РФ',
        cells: []
      },
    };

    data.metrics.cells = metrics.map(metric => metric.ru);

    for (let i=0; i<rowHeaders.length; i++) {
      data.rows.push({
        rowHeader: rowHeaders[i],
        margin: rowHeaders[i].length,
        cells: metrics.map( metric => {
          return this.getSumForMetricByFieldsAndFieldsValues(metric.ru, rowHeaders[i]);
        })
      })
    }

    data.sums.cells = metrics.map(metric => this.getSumForMetricByFieldsAndFieldsValues(metric.ru, []));

    return data;
  }
  
};
