const base_url = "http://192.168.63.128:2020/";
const base_image_url = base_url + "portal/image/";
const articleState = {
    delete: "0",
    publish: "1",
    draft: "2",
    top: "3"
}
const commentState = {
    publish: "1",
    top: "3"
}
export default {
    commentState,
    base_url,
    base_image_url,
    articleState,
}