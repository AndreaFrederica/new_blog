import type { CollectionEntry } from "astro:content";

// Shared data shapes inferred from src/content/config.ts
export type PostData = CollectionEntry<"posts">["data"];
export type NoteData = CollectionEntry<"notes">["data"];

export type PostEntry = CollectionEntry<"posts">;
export type NoteEntry = CollectionEntry<"notes">;

// Re-export existing list item shapes
export type Tag = { name: string; count: number };
export type Category = { name: string; count: number; url: string };

// Utility guards
export function ensureString(value: unknown, fallback = ""): string {
	return typeof value === "string" ? value : fallback;
}

export function toStringArray(arr: unknown): string[] {
	return Array.isArray(arr)
		? (arr as unknown[]).filter((x): x is string => typeof x === "string")
		: [];
}
