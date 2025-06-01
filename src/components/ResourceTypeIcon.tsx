import React from 'react';

interface ResourceTypeIconProps {
  type: 'book' | 'github' | 'article' | 'video';
  // className prop is removed as styling is now internal
}

const ResourceTypeIcon: React.FC<ResourceTypeIconProps> = ({ type }) => {
  const baseClasses = 'w-5 h-5 inline-block mr-2';
  let typeSpecificClasses = '';

  switch (type) {
    case 'book':
      typeSpecificClasses = 'text-blue-500 dark:text-blue-400';
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${baseClasses} ${typeSpecificClasses}`}>
          <path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM9 4H12V12L10.5 10.8L9 12V4Z" />
        </svg>
      );
    case 'github':
      typeSpecificClasses = 'text-green-500 dark:text-green-400';
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${baseClasses} ${typeSpecificClasses}`}>
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.38.201 2.397.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
      );
    case 'article': // Using a document icon for articles, blogs, papers, talks
      typeSpecificClasses = 'text-purple-500 dark:text-purple-400';
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${baseClasses} ${typeSpecificClasses}`}>
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" />
        </svg>
      );
    case 'video':
      typeSpecificClasses = 'text-red-500 dark:text-red-400';
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${baseClasses} ${typeSpecificClasses}`}>
          <path d="M8 5V19L19 12L8 5Z" />
        </svg>
      );
    default:
      return null;
  }
};

export default ResourceTypeIcon;
