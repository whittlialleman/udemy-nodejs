import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     // {title: 'First Post', content: 'This is the First\'s post\s content'},
    //     // {title: 'Second Post', content: 'This is the Second\'s post\s content'},
    //     // {title: 'Third Post', content: 'This is the Third\'s post\s content'},
    // ];
    posts: Post[] = [];
    isLoading = false;
   private postsSub: Subscription;

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.isLoading = false;
            this.posts = posts;
        });
    }

    onDelete(postID: string) {
        this.postsService.deletePost(postID);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}