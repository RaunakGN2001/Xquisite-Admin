'use client';


import { Modal } from "@/components/ui/modal";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
    return (
        <div className = 'p-4'>
            <Modal title={'Test'} description={'Test'} isOpen onClose={() => {
                isOpen = !isOpen;
            }}>
                Children
            </Modal>
        </div>
    )   
  }
  