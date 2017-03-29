import { List } from './list';
export class Board {
    id: number | string;
    name: string;
    lists: Array<List>;
    constructor(id: number | string, name: string, lists: List[]) {
        this.id = id;
        this.name = name;
        this.lists = lists;
    }
}