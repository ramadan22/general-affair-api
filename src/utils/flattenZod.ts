import { z } from 'zod';

type TreeError = {
  errors: string[];
  properties?: Record<string, TreeError>;
};

export function flattenZodErrors(error: z.ZodError): Record<string, string[]> {
  const tree = z.treeifyError(error) as TreeError;

  const result: Record<string, string[]> = {};

  if (tree.properties) {
    for (const [key, value] of Object.entries(tree.properties)) {
      if (value.errors && value.errors.length > 0) {
        result[key] = value.errors;
      }
    }
  }

  return result;
}
