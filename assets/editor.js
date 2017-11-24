(function() {
    'use strict';
    const noteDocument = $(document)
    const collaboratorsText = $('.navbar-brand .commentary')
    const PUSHER_INSTANCE_LOCATOR = "v1:us1:3ca672fc-0717-49a2-abb0-81677680b654"

    let note = {
        title: null,
        collaborators: [],
        textSync: undefined,
        currentNote: undefined,
    }

    const helpers = {
        /**
         * Load the note editors.
         */
        loadNoteEditors: () => {
            const noteSlug = document.URL.substr(document.URL.lastIndexOf('/') + 1)

            axios.get(`/api/notes/${noteSlug}`)
                .then(response => {
                    note.currentNote = response.data.data

                    $('title').text(note.Title)

                    note.textSync = new TextSync({ instanceLocator: PUSHER_INSTANCE_LOCATOR });
                    helpers.createTitleTextEditor()
                    helpers.createContentTextEditor()
                })
                .then(() => {
                    setTimeout(() => {
                        document.querySelector("#titleEditor .ql-editor")
                                .addEventListener("input", _.debounce(helpers.updateNoteTitle, 1000));
                    }, 3000)
                })
                .catch(err => window.location = '/')
        },

        /**
         * Update the title of the note.
         */
        updateNoteTitle: () => {
            const title = $('#titleEditor .ql-editor').text()

            axios.put(`/api/notes/${note.currentNote.Slug}`, {title})
        },

        /**
        * Create the text editor for the main content.
        *
        * @see https://docs.pusher.com/textsync/reference/js#editor-config-properties
        */
        createTitleTextEditor: () => {
            note.textSync.createEditor({
                element: '#titleEditor',
                docId: `${note.currentNote.Slug}-title`,
                richText: false,
                collaboratorBadges: false,
                defaultText: note.currentNote.Title,
            })
        },

        /**
         * Create the text editor for the main content.
         *
         * @see https://docs.pusher.com/textsync/reference/js#editor-config-properties
         */
        createContentTextEditor: () => {
            note.textSync.createEditor({
                element: "#editor",
                docId: `${note.currentNote.Slug}-content`,
                onCollaboratorsJoined: users => {
                    for (const key in users) {
                        note.collaborators[users[key].siteId] = users[key]
                    }

                    const count = Object.keys(note.collaborators).length
                    collaboratorsText.text((count > 1 ? `${count} collaborators.` : 'You are alone 😢'))
                }
            })
        },
    }

    noteDocument.ready(helpers.loadNoteEditors)
}());
