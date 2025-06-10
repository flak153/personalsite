declare global {
  interface Window {
    Prism: {
      highlightElement: (element: Element) => void;
      highlightAll: () => void;
      highlight: (text: string, grammar: any, language: string) => string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      languages: Record<string, any>;
    };
  }
}

export {};