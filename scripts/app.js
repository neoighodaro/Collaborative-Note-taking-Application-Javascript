var collaborators = [];

const initTextSync = function () {
    const textSync = new TextSync({ instanceLocator: "INSTANCE_LOCATOR" });

    return textSync.createEditor({
        // @see https://docs.pusher.com/textsync/reference/js#editor-config-properties

        // Required
        element: "#editor",
        docId: "collaborative-note-taking-app",

        // Optional
        // userName: "@neoighodaro",
        // userEmail: "neo@creativitykills.co",
        richText: true,
        cursors: true,
        cursorLabelsAlwaysOn: false,
        collaboratorBadges: true,
        errorNotifications: true,
        defaultText: "",

        // Callbacks
        onCollaboratorsJoined: function (users) {
            /* users = [{ name: String, avatar: String, siteId: Integer, timestamp: String }] */
            for (const user in users) {
                collaborators.push(user)
            }
        },
        onCollaboratorsLeft: function (users) {
            /* users = [{ name: String, avatar: String, siteId: Integer, timestamp: String }] */
        },
        /* @see https://docs.pusher.com/textsync/usage/displaying-errors */
        onError: function (error) {
            /* error = { notificationType: String [error|warning|info], message: String } */
        },
    })
};

const init = function () {
    window.textSyncInstance = initTextSync()
}

init()
