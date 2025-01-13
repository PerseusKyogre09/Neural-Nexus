import React, { Fragment, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className={`
            bg-white dark:bg-gray-800
            rounded-lg shadow-xl
            w-full max-w-md
            max-h-[90vh]
            overflow-hidden
            ${className}
          `}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 
              id="modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
}