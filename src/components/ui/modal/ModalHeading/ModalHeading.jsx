import { X } from "lucide-react";

function ModalHeading({ onClose, title }) {
    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-4xl font-bold text-transparent bg-gradient-to-l from-primary to-secondary bg-clip-text font-secondary">
                    {title}
                </h2>
                <X
                    onClick={onClose}
                    size={28}
                    className="hover:bg-white/30 transition-all p-1 rounded-full cursor-pointer text-white"
                />
            </div>
        </>
    )
}

export default ModalHeading
