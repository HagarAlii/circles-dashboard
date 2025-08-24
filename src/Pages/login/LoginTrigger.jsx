import { useEffect, useRef } from "react";
import Modal from "../../components/ui/modal/Modal";
import AdminLoginModalContent from "./AdminLoginModalContent";

export default function LoginTrigger() {
  const modalRef = useRef();

  // Automatically open modal on mount
  useEffect(() => {
    modalRef.current?.open();
  }, []);

  return (
    <>
      <Modal ref={modalRef}>
        <AdminLoginModalContent onClose={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}
