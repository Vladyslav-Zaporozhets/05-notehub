import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster, toast } from "react-hot-toast";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { CreateNoteParams } from "../../types/note";
import styles from "./App.module.css";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      toast.success("Note created successfully!");
    },
    onError: () => {
      toast.error("Failed to create note.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => {
      toast.error("Failed to delete note.");
    },
  });

  const handleCreateNote = (values: CreateNoteParams) => {
    createMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        {/* Використовуємо нову функцію handleSearch */}
        <SearchBox value={search} onChange={handleSearch} />
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {!isLoading && !isError && notes.length > 0 ? (
          <NoteList notes={notes} onDelete={handleDeleteNote} />
        ) : (
          !isLoading &&
          !isError && <p className={styles.empty}>No notes found.</p>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onSubmit={handleCreateNote} onCancel={closeModal} />
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
