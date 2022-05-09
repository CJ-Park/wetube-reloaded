export const recommend = (req, res) => res.render("home");
export const watch = (req, res) => {
    console.log(req.params);
    return res.render("watch");
}
export const edit = (req, res) => {
    console.log(req.params);
    return res.render("edit");
}
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete Video");
}