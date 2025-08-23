import { useState } from "react";
import Modal from "../components/Modal"

function EventsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // Handle confirm action
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <>
          <div className="backdrop" onClick={handleCancel}></div>
          <Modal
            title="Add Event"
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            canCancel={true}
            canConfirm={true}
          >
            <p>Modal Content</p>
          </Modal>
        </>
      )}
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn-create-event" onClick={() => setIsModalOpen(true)} >Create Event</button>
      </div>
    </>
  )
}

export default EventsPage