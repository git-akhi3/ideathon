import asyncHandler from "express-async-handler";

const checkPermission = (requiredPermission) => {
    return asyncHandler(async (req, res, next) => {
        // Log the user object to verify it's set correctly
        console.log("User in checkPermission:", req.user);

        if (!req.user) {
            res.status(401);
            return res.json({ message: 'Not authorized' });
        }

        // Log the permissions to verify they include the required permission
        console.log("User permissions:", req.user.permissions);

        if (!req.user.permissions.includes(requiredPermission)) {
            res.status(403);
            return res.json({ message: 'Not authorized for this operation' });
        }

        next();
    });
};

export default checkPermission;
