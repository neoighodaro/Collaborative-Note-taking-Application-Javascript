const slug = document.URL.substr(document.URL.lastIndexOf('/') + 1)

axios.get('/api/notes/'+slug).then(function (response) {
    const note = response.data.data

    // Could not find that note
    if ( ! note.ID) {
        return (window.location = '/')
    }

    let collaborators = []

    $('span.title').text(note.Slug)

    const textSync = new TextSync({ instanceLocator: "v1:us1:3ca672fc-0717-49a2-abb0-81677680b654" });

    return textSync.createEditor({
        // @see https://docs.pusher.com/textsync/reference/js#editor-config-properties
        element: "#editor",
        docId: note.Slug,
        onCollaboratorsJoined: function (users) {
            for (const key in users) {
                collaborators[users[key].siteId] = users[key]
            }

            const count = Object.keys(collaborators).length
            const str = count > 1 ? `${count} people are collaborating on this note.` : 'You are working alone, invite more people.'
            $('.navbar-brand .commentary').text(str)
        }
    })
})
