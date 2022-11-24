import { execute } from '../adapters/axios.adapter';
import { convert } from '../utils/convertXmlToJson';

export interface ForumOptions {
    id: number;
    page?: number;
};

interface Thread {
    id: number;
    subject: string;
    author: string;
    num_articles: number;
    post_date: Date;
    last_post_date: Date;
}

export interface ForumResponse {
    terms_of_use: string;
    id: number;
    title: string;
    num_threads: number;
    num_posts: number;
    last_post_date: Date;
    threads: Array<Thread>;
};

const mapForum: (o: { error: string | null, response: any }) => ForumResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }

    return {
        terms_of_use: response.forum.$.termsofuse,
        id: Number(response.forum.$.id),
        title: response.forum.$.title,
        num_threads: Number(response.forum.$.numthreads),
        num_posts: Number(response.forum.$.numposts),
        last_post_date: new Date(response.forum.$.lastpostdate),
        threads: response.forum.threads[0].thread.map(t => ({
            id: Number(t.$.id),
            subject: t.$.subject,
            author: t.$.author,
            num_articles: Number(t.$.numarticles),
            post_date: new Date(t.$.postdate),
            last_post_date: new Date(t.$.lastpostdate)
        }))
    }
};

export const forum = (options: ForumOptions, signal?: AbortSignal): Promise<ForumResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.id = String(options.id);

    if (options.page) {
        optionsObject.page = String(options.page);
    }

    return execute('forum', optionsObject, signal)
            .then(convert)
            .then(mapForum);
};
