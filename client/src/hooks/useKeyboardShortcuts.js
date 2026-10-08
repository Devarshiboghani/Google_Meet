import { useEffect } from 'react';

const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if the user is typing in an input or textarea
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      switch (key) {
        case 'm':
          if (handlers.toggleMicrophone) handlers.toggleMicrophone();
          break;
        case 'v':
          if (handlers.toggleCamera) handlers.toggleCamera();
          break;
        case 's':
          if (handlers.toggleScreenShare) handlers.toggleScreenShare();
          break;
        case 'c':
          if (handlers.toggleChat) handlers.toggleChat();
          break;
        case 'p':
          if (handlers.toggleParticipants) handlers.toggleParticipants();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};

export default useKeyboardShortcuts;
