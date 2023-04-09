import { useState } from "react";
import {
  ChakraProvider,
  SimpleGrid,
  Box,
  Flex,
  Button,
  Text,
  Input,
  Textarea,
  Drawer,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import NoteForm from "./NoteForm";
import "./app.css"

function App1() {
  const [notes, setNotes] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({});

  const handleAddNote = () => {
    const newNote = { id: nanoid(), title: "", content: "" };
    setNotes([...notes, newNote]);
    setCurrentNote(newNote);
    setIsDrawerOpen(true);
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsDrawerOpen(true);
  };

  const handleDeleteNote = (note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
  };

  const handleNoteChange = (e) => {
    setCurrentNote({
      ...currentNote,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ChakraProvider>
      <SimpleGrid columns={2} spacing={10} mt={10}>
        <Box>
          <Button onClick={handleAddNote} mb={4}>
            Add Note
          </Button>
          {notes.map((note) => (
            <Box key={note.id} mb={4}>
              <Text fontWeight="bold" mb={2}>
                {note.title}
              </Text>
              <Text mb={2}>{note.content}</Text>
              <Button onClick={() => handleEditNote(note)} mr={2}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteNote(note)}>Delete</Button>
            </Box>
          ))}
        </Box>
        <Drawer
          isOpen={isDrawerOpen}
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
        >
          <Box p={4}>
            <Text fontSize="xl" mb={4}>
              {currentNote.id ? "Edit Note" : "Add Note"}
            </Text>
            <NoteForm
              note={currentNote}
              onChange={handleNoteChange}
              onSubmit={() => {
                if (currentNote.id) {
                  setNotes(notes.map((n) => (n.id === currentNote.id ? currentNote : n)));
                } else {
                  setNotes([...notes, currentNote]);
                }
                setIsDrawerOpen(false);
              }}
              onCancel={() => {
                setIsDrawerOpen(false);
              }}
            />
          </Box>
        </Drawer>
      </SimpleGrid>
    </ChakraProvider>
  );
}

export default App1;