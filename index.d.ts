import * as riot from 'riot';

declare type riotShallowized = riot & { shallow: typeof riot.mount };
declare function shallowize(riot: typeof riot): riotShallowized;

export default shallowize;
