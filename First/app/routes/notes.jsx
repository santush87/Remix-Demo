import { redirect } from "@remix-run/node";
import NewNote from "../components/NewNote";
import NoteList from "../components/NoteList";
import { getStoredNotes, storeNotes } from "../data/notes";
import { useLoaderData } from "@remix-run/react";

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  // First way
  // return json(notes);

  // Second way
  // return new Response(JSON.stringify(notes), {
  //   headers: { "Content-Type": "application/json" },
  // });

  // Third way
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  // const noteData = {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // };
  // both are ok
  const noteData = Object.fromEntries(formData);

  // Add validation
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatesNotes = existingNotes.concat(noteData);
  await storeNotes(updatesNotes);

  return redirect("/notes");
}
