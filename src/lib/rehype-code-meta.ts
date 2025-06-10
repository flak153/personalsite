import { visit } from 'unist-util-visit';

export function rehypeCodeMeta() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Look for pre > code structure
      if (node.tagName === 'pre' && node.children?.[0]?.tagName === 'code') {
        const codeNode = node.children[0];
        
        // Transfer properties from code to pre
        if (codeNode.properties?.fileName) {
          node.properties = node.properties || {};
          node.properties.fileName = codeNode.properties.fileName;
        }
        
        if (codeNode.properties?.highlightLines) {
          node.properties = node.properties || {};
          node.properties.highlightLines = codeNode.properties.highlightLines;
        }
      }
    });
  };
}