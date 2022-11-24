import { execute } from '../adapters/axios.adapter';
import { convert } from '../utils/convertXmlToJson';

interface ThreadOptions {
    id: number;
    min_article_id?: number;
    min_article_date?: Date;
    count?: number;
};

interface Post {
    id: number;
    author: string;
    link: string;
    post_date: Date;
    last_edit_date: Date;
    num_edits: number;
    post_body: string;
}

interface ThreadResponse {
    terms_of_use: string;
    id: number;
    subject: string;
    num_posts: number;
    link: string;
    posts: Array<Post>;
};

const mapThread: (o: { error: string | null, response: any }) => ThreadResponse = ({ error, response }) => {
    if (error) {
        throw Error(error);
    }

    const { thread } = response;

    return ({
        terms_of_use: thread.$.termsofuse,
        id: Number(thread.$.id),
        subject: thread.subject[0],
        num_posts: Number(thread.$.numarticles),
        link: thread.$.link,
        posts: thread.articles[0].article.map(a => ({
            id: Number(a.$.id),
            author: a.$.username,
            link: a.$.link,
            post_date: new Date(a.$.postdate),
            last_edit_date: new Date(a.$.editdate),
            num_edits: Number(a.$.numedits),
            post_body: a.body[0]
        }))
    });
};

export const thread = (options: ThreadOptions, signal?: AbortSignal): Promise<ThreadResponse> => {
    let optionsObject: { [key: string]: string } = {};

    optionsObject.id = String(options.id);

    if (options.min_article_id) {
        optionsObject.minarticleid = String(options.min_article_id);
    }
    if (options.min_article_date) {
        optionsObject.minarticledate = new Date(options.min_article_date).toISOString().split('T')[0];
    }
    if (options.count) {
        optionsObject.count = String(options.count);
    }

    return execute('thread', optionsObject, signal)
            .then(convert)
            .then(mapThread);
};
