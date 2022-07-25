const fs = require('fs');
const path = require('path');
const util = require('util');

function pickFields(prev, curr, index) {
  const [key, value] = curr;

  const result = {
    order: index
  };

  const { properties } = value;

  if (properties) {
    result.properties = Object.entries(properties).reduce(pickFields, {});
  }

  return {
    ...prev,
    [key]: result
  };
}

const file = path.resolve(process.cwd(), process.argv[2]);

const json = fs.readFileSync(file, 'utf8');

const schema = JSON.parse(json);

const fieldOrders = Object.entries(schema.properties).reduce(pickFields, {});

const output = path.join(path.dirname(file), 'basic-orders.ts');

const code = `export const basicOrders = ${util.inspect(fieldOrders, {
  compact: false,
  depth: null
})} as const;` + '\n';

fs.writeFileSync(output, code, 'utf8');
