import { visit } from 'unist-util-visit';

export function remarkCodeMeta() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (!node.meta) return;
      
      // Initialize data and hProperties
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      
      // Parse highlight lines: {1,3-5}
      const highlightMatch = node.meta.match(/\{([\d,-]+)\}/);
      if (highlightMatch) {
        node.data.hProperties.highlightLines = highlightMatch[1];
      }
      
      // Parse fileName: fileName="test.js" or fileName=test.js
      const fileNameMatch = node.meta.match(/fileName=["']?([^"'\s{]+)["']?/);
      if (fileNameMatch) {
        node.data.hProperties.fileName = fileNameMatch[1];
      }
    });
  };
}