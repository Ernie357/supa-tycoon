import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ErrorStatus, StructuredError } from "./types"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

function boldText(text: string) {
	return `\x1b[1m${text}\x1b[0m`;
}

function redText(text: string) {
	return `\x1b[31m${text}\x1b[0m`;
}

function getErrorMessage(e: unknown): string {
	return e instanceof Error ? e.message : String(e);
}

export function logError(status: ErrorStatus, error: unknown): void {
	const details = getErrorMessage(error);
	console.error(`\n${redText(boldText(status))}`);
	console.error(`-------------------------`);
	console.error(`${details}\n`);
}