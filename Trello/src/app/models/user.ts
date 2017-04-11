export class User {
    id: number | string;
    username: string;
    constructor(id: number | string, name: string) {
        this.id = id;
        this.username = name;
    }
}