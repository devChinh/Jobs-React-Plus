import React, { useEffect, useReducer, useState } from "react";
import {
  ChakraProvider,
  SimpleGrid,
  Box,
  Button,
  Text,
  Input,
  Textarea,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from "@chakra-ui/react";
import NoteForm from "./NoteForm";

const initialState = {
  notes: []
};

function reducer(state, action) {
  switch (action.type) {
    case "addNote":
      return { notes: [...state.notes, action.payload] };
    case "editNote":
      const updatedNotes = state.notes.map((note) =>
        note.id === action.payload.id ? action.payload : note
      );
      return { notes: updatedNotes };
    case "deleteNote":
      const filteredNotes = state.notes.filter(
        (note) => note.id !== action.payload
      );
      return { notes: filteredNotes };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const noteLocal = (localStorage.getItem("note") || null )
    const arrNote = noteLocal.split(',')
    const allNote = { id: arrNote[0], title: arrNote[1], content: arrNote[2] }
    dispatch({ type: "addNote", payload: allNote });
  }, [])

  const handleAddNote = (props) => {
    const { id, title, content } = props
    JSON.stringify(localStorage.setItem("note", [id, title, content]));
    dispatch({ type: "addNote", payload: props });
    setIsDrawerOpen(false);
  };

  const handleEditNote = (id, title, content) => {
    const updatedNote = {
      id,
      title,
      content
    };
    dispatch({ type: "editNote", payload: updatedNote });
  };

  const handleDeleteNote = (id) => {
    dispatch({ type: "deleteNote", payload: id });
  };

  const notes = state.notes.map((note) => (
    <Box key={note.id} borderWidth="1px" borderRadius="lg" p="2">
      <Text fontWeight="bold">{note.title}</Text>
      <Textarea
        value={note.content}
        onChange={(e) => handleEditNote(note.id, note.title, e.target.value)}
      />
      <Button onClick={() => handleDeleteNote(note.id)}>Delete</Button>
    </Box>
  ));

  return (
    <ChakraProvider>
      <SimpleGrid columns={2} spacing="40px">
        <Box>
          <Button onClick={() => setIsDrawerOpen(true)}>New Note</Button>
          {notes}
        </Box>
        <Box>
          <Drawer placement="right" onClose={() => setIsDrawerOpen(false)} isOpen={isDrawerOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Create a new note</DrawerHeader>
              <DrawerBody>
                <NoteForm onAddNote={handleAddNote} />
              </DrawerBody>
              <DrawerFooter>
                <Button mr={3} onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      </SimpleGrid>
    </ChakraProvider>
  );
}

export default App;