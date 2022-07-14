import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
};

export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMsg: "Password confirm failed",
        });
    }
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMsg: "This username/email is already in use"
        });
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMsg: error
        });
    }
    
};

export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Log In"})
}

export const postLogin = async(req, res) => {
    const pageTitle = "Log In"
    const {username, password} = req.body;
    const findUser = await User.findOne({username});
    if(!findUser) {
        return res.status(400).render("login", {
            pageTitle,
            errorMsg: "An account with this username does not exists"});
    }
    const ok = await bcrypt.compare(password, findUser.password);
    if(!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMsg: "Wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = findUser;
    return res.redirect("/");
}

export const logout = (req, res) => res.send("Log Out");

export const edit = (req, res) => res.send("Edit User");

export const remove = (req, res) => res.send("Delete User");

export const see = (req, res) => res.send("See User Profile");