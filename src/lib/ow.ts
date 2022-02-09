import owImport, { type Ow } from 'ow';

const ow: Ow = Reflect.has(owImport, '__esModule')
  ? Reflect.get(owImport, 'default')
  : owImport;

export default ow;
