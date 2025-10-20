// client/src/components/common/AIFeedbackModal.js
import { useEffect, useState } from 'react';
import { XIcon, Lightbulb } from 'lucide-react';
import Button from './Button';

const AIFeedbackModal = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-xl shadow-lg border border-primary/20 transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="p-4 flex items-start">
        <div className="mr-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <Lightbulb size={18} className="text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-primary-dark">AI Suggestion</h4>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="p-1 rounded-full hover:bg-neutral-gray/30"
            >
              <XIcon size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-3">{message}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Dismiss
            </Button>
            <Button size="sm">Apply Suggestion</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeedbackModal;