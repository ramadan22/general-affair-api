import { z } from 'zod';

type TreeError = {
  errors: string[];
  properties?: Record<string, TreeError>;
  items?: TreeError[];
};

export function flattenZodErrors(error: z.ZodError): Record<string, string[]> {
  const tree = z.treeifyError(error) as TreeError;
  const result: Record<string, string[]> = {};

  function traverse(node: TreeError, path: string[] = []) {
    // simpan error pada node ini
    if (node.errors && node.errors.length > 0) {
      const key = path.join('.');
      result[key] = (result[key] || []).concat(node.errors);
    }

    // handle nested object
    if (node.properties) {
      for (const [childKey, childNode] of Object.entries(node.properties)) {
        traverse(childNode, [...path, childKey]);
      }
    }

    // handle array
    if (node.items) {
      node.items.forEach((item, idx) => {
        traverse(item, [...path, String(idx)]);
      });
    }
  }

  traverse(tree);
  return result;
}
