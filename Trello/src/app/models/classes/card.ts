import { Comment } from './comment';
export class Card {
    name: string;
    description: string;
    date: string;
    comments: Array<Comment>;
    constructor (name: string, description: string, date: string, comments: Array<Comment> ) {
        this.name=name;
        this.description=description;
        this.date=date;
        this.comments = comments;
    }
}