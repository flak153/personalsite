import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

interface ElementNode extends Node {
  type: 'element';
  tagName?: string;
  children?: ElementNode[];
  properties?: Record<string, string>;
}

export function rehypeCodeMeta() {
  return (tree: Node) => {
    visit(tree, 'element', (node: ElementNode) => {
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