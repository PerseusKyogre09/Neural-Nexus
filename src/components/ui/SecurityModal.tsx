import { Modal } from './Modal';
import { ScrollArea } from './ScrollArea';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function SecurityModal({ isOpen, onClose, content }: SecurityModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security Information">
      <ScrollArea className="h-[70vh]">
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </ScrollArea>
    </Modal>
  );
}
