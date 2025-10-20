// client/src/components/common/Card.js
import React from 'react';

const Card = ({ children, title, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-neutral-gray/50 ${className}`}
    >
      {title && (
        <div className="px-5 py-4 border-b border-neutral-gray/50">
          <h3 className="font-medium text-primary-dark">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;