import { useContext, useEffect, useRef, useState } from "react";
import Modal from "../components/Modal"
import { AuthContext } from "../context/AuthContext";
import EventItem from "../components/EventItem";
import LoadingSpinner from "../components/LoadingSpinner";

function EventsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();

  const authContext = useContext(AuthContext);

  const handleBookEvent = ()=>{};

  const showDetailHandler = (eventId)=>{
    const event = events.find(e => e._id === eventId);
    setSelectedEvent(event);
  };

  const fetchEvents= async () =>{
    
    setIsLoading(true);

    const reqBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `
    }

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
      });

      const result = await res.json();

      setEvents(result.data.events);
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    };
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleConfirm = async () => {

    setIsModalOpen(false);

    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;

    if(!title.trim() || !date.trim() || !description.trim() || +price < 0) return;

    const reqBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `
    }
    
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authContext.token
        },
        body: JSON.stringify(reqBody)
      });

      const result = await res.json();

      setEvents(prevEvents => [...prevEvents, result.data.createEvent]);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchEvents();
  },[]);

  const eventList = events.map(event => (
    <EventItem 
      key={event._id} 
      eventId={event._id} 
      title={event.title} 
      price={event.price} 
      date={event.date} 
      description={event.description} 
      isCreator={event.creator._id === authContext.userId}
      onViewDetail={showDetailHandler}
    />
  ));

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
            confirmText={"Confirm"}
          >
            <div>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={titleRef} placeholder=""/>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" placeholder="$" ref={priceRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={dateRef}/>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={descriptionRef}></textarea>
              </div>
            </div>
          </Modal>
        </>
      )}
      {selectedEvent && (
        <>
          <div className="backdrop" onClick={handleCancel}></div>
          <Modal
            title={"Event Details"}
            onCancel={handleCancel}
            onConfirm={handleBookEvent}
            canCancel={true}
            canConfirm={!!authContext.token && (authContext.userId !== selectedEvent.creator._id)}
            confirmText={"Book"}
          >
            <div>
              <h2>{selectedEvent.title}</h2>
              <p>${selectedEvent.price}</p>
              <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p>{selectedEvent.description}</p>
              <p>Created by: {selectedEvent.creator.email}</p>
            </div>
          </Modal>
        </>
      )}
      {authContext.token &&
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn-create-event" onClick={() => setIsModalOpen(true)} >Create Event</button>
      </div>}
      {isLoading ? 
      <LoadingSpinner/> :
      <section className="event-list">
        <ul className="events-ul">
          {eventList}
        </ul>
      </section>}
    </>
  )
}

export default EventsPage