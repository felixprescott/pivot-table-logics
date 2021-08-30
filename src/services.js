import { dataset } from './dataset';

export default class DatasetService {
  getUniqueMetrics = () => {
    const uniqueMetrics = new Set();
    dataset.map( (item) => {uniqueMetrics.add(item.metric); return null;} );
    return Array.from(uniqueMetrics);
  }

  getUniqueValuesByField = (field) => {
    const uniqueValues = new Set();
    dataset.map( (item) => {
      uniqueValues.add(item[field]);
      return null;
    });
    return Array.from(uniqueValues);
  }

  getFields = () => {
    //return dataset.length ? Object.keys(dataset[0]) : [];
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
};
