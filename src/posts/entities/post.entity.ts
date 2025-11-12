export class PostCategory {
    name: string;
    categoryId: string;
}

export class Post {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    categories: PostCategory[];

    authorName: string;
    createdAt: number;
    updatedAt?: number;
    featuredImage?: string;
}
