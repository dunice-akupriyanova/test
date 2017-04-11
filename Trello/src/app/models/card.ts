import { Comment } from './comment';
export class Card {
    id: number | string;
    name: string;
    description: string;
    date: string;
    comments: Array<Comment>;
    members: Array<String>;
    constructor (id: number | string, name: string, description: string, date: string, comments: Array<Comment>, members: Array<String> ) {
        this.id = id;
        this.name=name;
        this.description=description;
        this.date=date;
        this.comments = comments;
        this.members = members;
    }
}