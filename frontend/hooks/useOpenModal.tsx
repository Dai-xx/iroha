import { useState } from "react";

export const useOpenModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, setIsOpen, openModal, closeModal };
};
