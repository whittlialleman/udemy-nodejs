import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

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
    totalPosts = 10;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];
    private postsSub: Subscription;

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    onDelete(postID: string) {
        this.isLoading = true;
        this.postsService.deletePost(postID).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}