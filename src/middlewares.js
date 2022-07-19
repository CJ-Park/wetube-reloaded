import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        next();
    } else {
        res.redirect("/");
    }
};

export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
});

export const videoUpload = multer({
    dest:"uploads/videos/",
    limits: {
        fileSize: 100000000,
    },
});
