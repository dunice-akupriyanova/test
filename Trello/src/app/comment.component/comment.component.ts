import { Component, Input } from '@angular/core';
import { Comment } from '../models/classes/comment';

@Component({
    selector: 'comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css'],
    providers: []
})
export class CommentComponent {
    @Input()
    comment: Comment;
    @Input()
    user: string;
}
