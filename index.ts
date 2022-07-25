import { basicOrders } from './basic-orders';

export type FieldOrders = {
  [key in string]: {
    order: number;
    properties?: FieldOrders;
  };
};

/**
 * sort package.json's fields
 */
export function sortPackageFields(
  fields: string | Record<string, unknown>,
  orders: FieldOrders = basicOrders
): Record<string, any> {
  const sourceFields =
    typeof fields === 'string' ? JSON.parse(fields) : { ...fields };

  const keys = Object.keys(sourceFields);
  const ordersKeys = Object.keys(orders);

  const basics: string[] = [];
  const others: string[] = [];

  for (const key of keys) {
    if (ordersKeys.includes(key)) {
      basics.push(key);
    } else {
      others.push(key);
    }
  }

  basics.sort(function ascendingSort(a: string, b: string): -1 | 0 | 1 {
    const aIndex = orders[a]?.order;
    const bIndex = orders[b]?.order;

    if (aIndex === undefined || bIndex === undefined) {
      return 0;
    }

    if (aIndex < bIndex) {
      return -1;
    }

    if (aIndex > bIndex) {
      return 1;
    }

    return 0;
  });
  others.sort(function ascendingSort(a: string, b: string): -1 | 0 | 1 {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  });

  return [...basics, ...others].reduce(function (prev, curr) {
    const result: Record<string, unknown> = {
      ...prev
    };

    const properties = orders[curr]?.properties;

    result[curr] = properties
      ? sortPackageFields(sourceFields[curr], properties)
      : sourceFields[curr];

    return result;
  }, {});
}
