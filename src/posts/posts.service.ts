import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository } from 'typeorm';


@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepository: Repository<Post>, private usersService: UsersService) { }
    //title,content,authorId: number
    async createPosts(post: CreatePostDto) {
        const userFound = await this.usersService.getUser(post.authorId)
        if (!userFound) return new HttpException('User not found', HttpStatus.NOT_FOUND)


        const newPost = this.postsRepository.create(post)
        return this.postsRepository.save(newPost)
    }
    getPosts() {
        return this.postsRepository.find({
            relations: ['author'],
        })
    }
}
