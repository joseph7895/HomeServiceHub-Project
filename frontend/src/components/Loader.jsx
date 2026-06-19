import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  return (
    <div class="flex items-center justify-center py-8">
      <div
        class={`${sizeClasses[size] || sizeClasses.medium} animate-spin rounded-full border-slate-700 border-t-brand-500`}
      ></div>
    </div>
  );
};

export default Loader;
