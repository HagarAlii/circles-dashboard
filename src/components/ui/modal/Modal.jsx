import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children }, ref) {
  const modalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (modalRef.current) {
        if (!modalRef.current.open) {
          modalRef.current.showModal();
          setIsOpen(true);
        }
      }
    },
    close: () => {
      modalRef.current?.close();
      setIsOpen(false);
    },
  }));

  // Close handler to reset isOpen state when dialog is closed by user (e.g. ESC key or clicking outside)
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    function handleClose() {
      setIsOpen(false);
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return createPortal(
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-black/30 bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => {
            modalRef.current?.close();
          }}
        />
      )}

     <dialog
  ref={modalRef}
  style={{ transform: "translate(-50%, -50%)" }}
  className={`
    fixed top-1/2 left-1/2 z-50
    max-w-lg w-full
    rounded-3xl
  
    backdrop-blur-lg
  
    shadow-lg
   
    text-white
    animate-fadeIn
    
  `}
>
  {children}
</dialog>


      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </>,
    document.getElementById("modal-root")
  );
});

export default Modal;
