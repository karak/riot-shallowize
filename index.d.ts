import * as riot from 'riot';

declare type riotShallowized = typeof riot & { shallow: typeof riot.mount };
declare function shallowize(riotInstance: typeof riot): riotShallowized;

export default shallowize;
