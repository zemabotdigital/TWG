/**
 * Shared form-state shapes.
 *
 * These live outside the "use server" action files on purpose: a server-action
 * module is only allowed to export async functions, so the types and the
 * initial-state constants have to be declared somewhere neutral that both the
 * actions and the client forms can import.
 */

export type FormState = {
  ok: boolean;
  message?: string;
  reference?: string;
  errors?: Record<string, string>;
};

export const emptyFormState: FormState = { ok: false };

export type AdminState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export const emptyAdminState: AdminState = { ok: false };
