import { Comment } from './comment';
export class Card {
    id: number | string;
    name: string;
    description: string;
    date: string;
    comments: Array<Comment>;
    constructor (id: number | string, name: string, description: string, date: string, comments: Array<Comment> ) {
        this.id = id;
        this.name=name;
        this.description=description;
        this.date=date;
        this.comments = comments;
    }
}