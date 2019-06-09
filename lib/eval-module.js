import { Module } from 'module';
import { createContext, runInNewContext } from 'vm';

function evalModule(code) {
  code = code.replace('export default', 'exports = ');
  const module = new Module();
  const context = createContext(module);
  runInNewContext(code, context);
  return module.exports;
}

export default evalModule;
