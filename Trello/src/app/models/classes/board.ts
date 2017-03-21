export class Board {
    name: string;
    lists: Array<List>;
    constructor (name: string, lists: List[]) {
        this.name=name;
        this.lists=lists;
    }
}