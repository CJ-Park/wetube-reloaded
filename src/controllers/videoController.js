export const recommend = (req, res) => res.send("Home Page Videos");
export const watch = (req, res) => {
    console.log(req.params);
    return res.send(`Watch Video #${req.params.id}`);
}
export const edit = (req, res) => {
    console.log(req.params);
    return res.send("Edit Video");
}
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete Video");
}