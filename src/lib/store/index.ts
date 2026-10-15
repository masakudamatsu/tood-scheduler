import { isLocalMode } from "../supabaseClient";
import type { TaskStore } from "../types";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";

export const store: TaskStore = isLocalMode ? localStore : supabaseStore;
