import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@chakra-ui/react";
import { nanoid } from "nanoid";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code"],
        ["undo", "redo"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "code",
];

function NoteForm(props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value);
    };
    const handleSaveNote = () => {
        const newNote = {
            id: nanoid(),
            title,
            content
        };
        props.onAddNote(newNote)
        setTitle("");
        setContent("");
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
            />
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
            />
            <Button mt={3} type="button" onClick={handleSaveNote}>
                Save
            </Button>
        </div>
    );
}

export default NoteForm;