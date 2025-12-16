import { z } from 'zod';
export function flattenZodErrors(error) {
    const tree = z.treeifyError(error);
    const result = {};
    function traverse(node, path = []) {
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
