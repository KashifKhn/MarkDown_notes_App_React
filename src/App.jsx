import React from "react"
import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {

  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  )

  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0]?.id) || ""
  )

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    setNotes(oldNotes => {
      const newArr = []
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArr.unshift({ ...oldNote, body: text })
        }
        else {
          newArr.push(oldNote)
        }
      }
      return newArr
    })

    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ? { ...oldNote, body: text }
    //     : oldNote
    // }))

  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(oldNotes => oldNotes.filter(note => note.id != noteId))
  }

  // function findCurrentNote() {
  //   return notes.find(note => {
  //     return note.id === currentNoteId
  //   }) || notes[0]
  // }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={currentNote}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
