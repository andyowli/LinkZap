const POSTS_QUERY = `*[ _type == "post" && !(_id in path("drafts.**"))]{
    _id,
    title,
    "slug": slug.current,
    category,
    "imgurl":image.asset->url,
    "webUrl":website,
    "content":body[].children[].text,
    featured
}`;

const POST_SIDEBAR = `*[_type == "sidebar"]{
    _id,
    title
}`;

const options = { next: { revalidate: 10 } };

export { POSTS_QUERY, POST_SIDEBAR, options };