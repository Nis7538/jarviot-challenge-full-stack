const asyncWrapper = require("../middleware/async");
const { google } = require("googleapis");
const User = require("../models/User");
const dotenv = require("dotenv");
const createCustomAPIError = require("../errors/error-handler");

dotenv.config();

// @desc    Generate URL for authentication
// @route   GET /api/v1/
// @access  Public
const generateURL = asyncWrapper(async (req, res, next) => {
    const SCOPES =
        "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile";

    var url = global.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });

    res.status(200).json({ success: true, data: url });
});

// @desc    Authenticate user
// @route   GET /api/v1/google/callback
// @access  Public
const authenticateUser = asyncWrapper(async (req, res, next) => {
    const code = req.query.code;

    if (code) {
        global.oAuth2Client.getToken(code, (error, tokens) => {
            if (error) {
                return next(createCustomAPIError("Can't generate token", 401));
            } else {
                global.oAuth2Client.setCredentials(tokens);

                // // Create a new Drive API client

                // Create a new Drive API client
                const drive = google.drive({
                    version: "v3",
                    auth: global.oAuth2Client,
                });

                // Retrieve information about the authenticated user
                drive.about.get(
                    {
                        fields: "user",
                    },
                    async (err, result) => {
                        if (err) {
                            console.log(error);
                            return next(
                                createCustomAPIError(
                                    "Error in getting information",
                                    400,
                                ),
                            );
                        }

                        // Extract the email address from the response
                        const emailAddress = result.data.user.emailAddress;

                        let _user = await User.findOne({
                            userEmail: emailAddress,
                        });

                        if (!_user) {
                            _user = await User.create({
                                userEmail: emailAddress,
                                token: JSON.stringify(tokens),
                            });
                        }

                        _user.token = JSON.stringify(tokens);
                        await _user.save();

                        const token =
                            (_user && getTokenResponse(_user)) || null;
                        res.redirect(
                            "http://localhost:5173/google/callback?token=" +
                            token,
                        );
                    },
                );
            }
        });
    }
});

// @desc    Get user details
// @route   GET /api/v1/getUserDetails
// @access  Private
const getUserDetails = asyncWrapper(async (req, res, next) => {
    const token = JSON.parse(req.user.token);
    global.oAuth2Client.setCredentials(token);
    let obj = {};

    const drive = google.drive({
        version: "v3",
        auth: global.oAuth2Client,
    });

    const oauth2 = google.oauth2({
        auth: global.oAuth2Client,
        version: "v2",
    });

    const about = await drive.about.get({
        fields: "storageQuota",
    });

    const storageQuota = about.data.storageQuota;

    obj.storageUsage = storageQuota.usage;
    obj.storageAvailable = storageQuota.limit;

    oauth2.userinfo.get((error, response) => {
        if (error) throw error;
        obj.name = response.data.name;
        obj.imageUrl = response.data.picture;
    });

    const fileList = await drive.files.list({
        q: "mimeType != \"application/vnd.google-apps.folder\"",
        pageSize: 1000,
        fields: "nextPageToken, files(name, createdTime, webViewLink, size, shared)",
    });

    obj.files = fileList.data.files;
    res.status(200).json({ success: true, data: obj });
});

// @desc    Revoke access
// @route   DELETE /api/v1/revokeAccess
// @access  Private
const revokeAccess = asyncWrapper(async (req, res, next) => {
    global.oAuth2Client.setCredentials(JSON.parse(req.user.token));
    global.oAuth2Client.revokeCredentials(async (err, result) => {
        if (err) {
            console.log(err);
            return next(createCustomAPIError("Error in revoking access", 401));
        } else {
            const user = await User.findByIdAndDelete(req.user._id);
            if (!user) {
                return next(createCustomAPIError("User does not exist", 401));
            }
            res.status(200)
                .cookie("token", "none", {
                    expires: new Date(Date.now() + 10 * 1000),
                    httpOnly: true,
                })
                .json({
                    success: true,
                    message: "Token revoked succcessfully",
                });
        }
    });
});

const getTokenResponse = user => {
    return user.getSignedJWTToken();
};

module.exports = {
    generateURL,
    authenticateUser,
    revokeAccess,
    getUserDetails,
};
