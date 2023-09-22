import React from "react"
import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { notesCollection } from "./firebase"
import { db } from "./firebase"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"

export default function App() {

  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState("")
  const [tempNoteText, setTempNoteText] = useState("");

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  useEffect(() => {
    const unSubscribe = onSnapshot(notesCollection, (snapshot) => {
      //  sync up our local note array with the snapshot data
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr)
    })
    return unSubscribe
  }, [])

  useEffect(() => {
    if (currentNote)
      setTempNoteText(currentNote.body)
  }, [currentNote])

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body)
        updateNote(tempNoteText)
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [tempNoteText])

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  async function createNewNote() {
    const newNote = {
      body: "# Type your title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
  }

  async function updateNote(text) {
    const docRef = doc(db, 'notes', currentNoteId)
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    )

    // setNotes(oldNotes => {
    //   const newArr = []
    //   for (let i = 0; i < oldNotes.length; i++) {
    //     const oldNote = oldNotes[i];
    //     if (oldNote.id === currentNoteId) {
    //       newArr.unshift({ ...oldNote, body: text })
    //     }
    //     else {
    //       newArr.push(oldNote)
    //     }
    //   }
    //   return newArr
    // })
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ? { ...oldNote, body: text }
    //     : oldNote
    // }))
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, 'notes', noteId)
    await deleteDoc(docRef)
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
              notes={sortedNotes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
            />
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
