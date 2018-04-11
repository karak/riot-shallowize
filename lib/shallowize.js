import * as riot from 'riot';
import shallow from './shallow';

export default function shallowize(riot) {
  return { ...riot, shallow };
}
