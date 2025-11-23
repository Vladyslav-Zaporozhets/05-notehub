// src/types/note.ts

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  date: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  notes: Note[];
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}
