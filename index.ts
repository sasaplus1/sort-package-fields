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

  function ascendingSort<T extends string | number>(a: T, b: T): -1 | 0 | 1 {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  basics.sort(function (a, b) {
    const aIndex = orders[a]?.order;
    const bIndex = orders[b]?.order;

    if (aIndex === undefined || bIndex === undefined) {
      return 0;
    }

    return ascendingSort(aIndex, bIndex);
  });
  others.sort(ascendingSort);

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
