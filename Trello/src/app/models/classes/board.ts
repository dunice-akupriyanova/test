import {List} from './list';
export class Board {
    id: number;
    name: string;
    lists: Array<List>;
    constructor (id: number, name: string, lists: List[]) {
        this.id=id;
        this.name=name;
        this.lists=lists;
    }
}