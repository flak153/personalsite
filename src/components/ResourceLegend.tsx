import React from 'react';
import ResourceTypeIcon from './ResourceTypeIcon';

const ResourceLegend: React.FC = () => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Icon Legend:</h4>
      <ul className="list-none pl-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <li className="flex items-center">
          <ResourceTypeIcon type="book" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Book</span>
        </li>
        <li className="flex items-center">
          <ResourceTypeIcon type="github" />
          <span className="text-sm text-gray-600 dark:text-gray-400">GitHub Repository</span>
        </li>
        <li className="flex items-center">
          <ResourceTypeIcon type="article" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Article/Blog/Paper/Talk</span>
        </li>
        <li className="flex items-center">
          <ResourceTypeIcon type="video" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Video/Lecture</span>
        </li>
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        Note: Icons are placeholders. You can customize their appearance and colors via CSS.
      </p>
    </div>
  );
};

export default ResourceLegend;
