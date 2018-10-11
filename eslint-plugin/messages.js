const metaTypes = require('../lib/meta-types');

module.exports = {
  array: 'Unsupported type "array". Replace with "arrayOf" or add meta type',
  badFunctionCall: `Expected one of [${Object.values(
    metaTypes.functions
  )}] but got '{{value}}'.`,
  badStringLiteral: `Expected one of [${Object.values(
    metaTypes.strings
  )}] but got '{{value}}'.`,
  illegalFunctionCall: `Illegal function call`,
  importedArrayReference: `Imported arrays are not supported.`,
  importedObjectReference: `Imported objects are not supported.`,
  missingObjectReference: 'Missing object value for prop.',
  noExport: `No export statement. Couldn't get component name.`,
  object: 'Unsupported type "object". Replace with "shape" or add meta type.',
  oneOfType: 'Unsupported type "oneOfType".',
  propNameCollision: `Prop can't have the same name as the component.`,
  tooManyExports: `Too many exports. Couldn't get component name.`
};
