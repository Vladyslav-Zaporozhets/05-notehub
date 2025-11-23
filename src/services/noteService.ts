import axios from "axios";
import type { CreateNoteParams, Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  notes: Note[];
}

export const fetchNotes = async (
  page: number,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const config = {
    params: {
      page,
      perPage: 12,
      search,
    },
  };
  const { data } = await api.get<FetchNotesResponse>("", config);
  return data;
};

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
  const { data } = await api.post<Note>("", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/${id}`);
  return data;
};
