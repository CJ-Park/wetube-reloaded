import User from "../models/User";
import fetch from "cross-fetch";
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
    const pageTitle = "Log In";
    const {username, password} = req.body;
    const findUser = await User.findOne({username, socialOnly:false});
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

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            }
        })
    ).json();
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        console.log(userData);
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if(!user) {
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password:"",
                socialOnly: true,
                location: userData.location,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }
    else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
};

export const postEdit = async(req, res) => {
    const {
        session: {
            user: {_id, avatarUrl},
        },
        body: {name, username, email, location},
        file,
    } = req;
    const duplicateUsername = await User.findOne({username});
    const duplicateEmail = await User.findOne({email});
    console.log(req.session.user.name);
    console.log(duplicateUsername);
    if(duplicateUsername && duplicateUsername.name !== req.session.user.name) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMsg: "The username is already in use"
        })
    }
    if(duplicateEmail && duplicateEmail.email !== req.session.user.email) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMsg: "The email is already in use"
        })
    }
    const updatedUser = await User.findByIdAndUpdate(_id, 
        {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        username,
        email,
        location,
        },
        {new: true}
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const getEditPassword = (req, res) => {
    if(req.session.socialOnly) {
        return res.redirect("/");
    }
    return res.render("users/edit-password", {pageTitle: "Edit Password"});
}

export const postEditPassword = async(req, res) => {
    const {
        session: {
            user: {_id},
        },
        body: {oldPass, newPass, newPass2},
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPass, user.password);
    if(!ok) {
        return res.status(400).render("users/edit-password", {
            pageTitle: "Edit Password", 
            errorMsg: "The current password is incorrect",
        });
    }
    if(newPass !== newPass2) {
        return res.status(400).render("users/edit-password", {
            pageTitle: "Edit Password", 
            errorMsg: "The new password does not match"
        });
    }
    user.password = newPass;
    await user.save();

    return res.redirect("/users/logout");
}

export const see = (req, res) => res.send("See User Profile");