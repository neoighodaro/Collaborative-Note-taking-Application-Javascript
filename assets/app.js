(function() {
    'use strict';
    const noteDocument = $(document)
    const createButton = $('#create-btn')
    const notesList    = $('.list-group.list-group-flush')

    const helpers = {
        /**
         * On click, create a new note and redirect to it...
         */
        createNoteAndRedirect: evt => {
            axios.post('/api/notes').then(response => (window.location = '/notes/'+response.data.data.ID))
        },

        /**
         * Load the notes to the page...
         */
        loadNotes: evt => {
            axios.get('/api/notes').then(response => {
                const notes = response.data.data

                for (var index = 0; index < notes.length; index++) {
                    notesList.append(
                        `<a href="/notes/${notes[index].ID}" class="list-group-item list-group-item-action">
                            ${notes[index].Title}
                        </a>`
                    )
                }
            })
        }
    }

    noteDocument.ready(helpers.loadNotes)
    createButton.click(helpers.createNoteAndRedirect)
}())
