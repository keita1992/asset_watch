import _ from 'lodash';

interface DataItem {
  [key: string]: any;
}

// dataをgroupByKeyでグループ化し、sumByKeyで集計した結果を返す
export const sumBy = (data: DataItem[], groupByKey: string, sumByKey: string): Record<string, number> => {
  if (!data.every(item => item.hasOwnProperty(groupByKey) && item.hasOwnProperty(sumByKey))) {
    throw new Error('Some items do not have the specified keys.');
  }
  return _(data)
    .groupBy(groupByKey)
    .mapValues((group) => _.sumBy(group, sumByKey))
    .value();
}

// dataをgroupByKeyでグループ化し、ユニークなgroupの数を返す
export const countBy = (data: DataItem[], groupByKey: string): number => {
  if (!data.every(item => item.hasOwnProperty(groupByKey))) {
    throw new Error('Some items do not have the specified keys.');
  }
  return _(data)
    .groupBy(groupByKey)
    .keys()
    .value()
    .length;
}