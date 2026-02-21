"use client";

import { create } from "zustand";
import type { Event } from "@/types/event";
import type { EventFormData } from "@/types/event";
import type { Forum } from "@/types/forum";
import type { ForumFormData } from "@/types/forum";
import { useAuthStore } from "./auth-store";

interface DataState {
  events: Event[];
  forums: Forum[];
  isLoading: { events: boolean; forums: boolean };
  setEvents: (events: Event[]) => void;
  setForums: (forums: Forum[]) => void;
  fetchEvents: () => Promise<void>;
  fetchForums: () => Promise<void>;
  createEvent: (data: EventFormData) => Promise<Event>;
  createForum: (data: ForumFormData) => Promise<Forum>;
  updateEvent: (slug: string, data: EventFormData) => Promise<Event>;
  updateForum: (slug: string, data: ForumFormData) => Promise<Forum>;
}

export const useDataStore = create<DataState>((set, get) => ({
  events: [],
  forums: [],
  isLoading: { events: false, forums: false },

  setEvents: (events) => set({ events }),
  setForums: (forums) => set({ forums }),

  fetchEvents: async () => {
    set((s) => ({ isLoading: { ...s.isLoading, events: true } }));
    try {
      const res = await fetch("/api/events");
      const events = (await res.json()) as Event[];
      set({ events, isLoading: { ...get().isLoading, events: false } });
    } catch {
      set((s) => ({ isLoading: { ...s.isLoading, events: false } }));
    }
  },

  fetchForums: async () => {
    set((s) => ({ isLoading: { ...s.isLoading, forums: true } }));
    try {
      const res = await fetch("/api/forums");
      const forums = (await res.json()) as Forum[];
      set({ forums, isLoading: { ...get().isLoading, forums: false } });
    } catch {
      set((s) => ({ isLoading: { ...s.isLoading, forums: false } }));
    }
  },

  createEvent: async (data: EventFormData) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to create event");
    }
    const event = (await res.json()) as Event;
    set((s) => ({ events: [...s.events, event] }));
    return event;
  },

  createForum: async (data: ForumFormData) => {
    const res = await fetch("/api/forums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to create forum");
    }
    const forum = (await res.json()) as Forum;
    set((s) => ({ forums: [...s.forums, forum] }));
    return forum;
  },

  updateEvent: async (slug: string, data: EventFormData) => {
    const res = await fetch(`/api/events/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to update event");
    }
    const event = (await res.json()) as Event;
    set((s) => ({
      events: s.events.map((e) => (e.slug === slug ? event : e)),
    }));
    return event;
  },

  updateForum: async (slug: string, data: ForumFormData) => {
    const res = await fetch(`/api/forums/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to update forum");
    }
    const forum = (await res.json()) as Forum;
    set((s) => ({
      forums: s.forums.map((f) => (f.slug === slug ? forum : f)),
    }));
    return forum;
  },
}));

export function useMyCreatedEvents(): Event[] {
  const user = useAuthStore((s) => s.user);
  const events = useDataStore((s) => s.events);
  if (!user) return [];
  return events.filter((e) => e.createdBy === user.id);
}

export function useMyCreatedForums(): Forum[] {
  const user = useAuthStore((s) => s.user);
  const forums = useDataStore((s) => s.forums);
  if (!user) return [];
  return forums.filter((f) => f.createdBy === user.id);
}

export function useMyRegisteredEvents(): Event[] {
  const user = useAuthStore((s) => s.user);
  const events = useDataStore((s) => s.events);
  if (!user) return [];
  return events.filter((e) => e.registrations?.includes(user.id));
}
