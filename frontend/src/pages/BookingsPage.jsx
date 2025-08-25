import { useContext, useEffect, useState, useMemo } from "react"
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../context/AuthContext";
import BookingItem from "../components/BookingItem";

function BookingsPage() {

  const [isLoading,setIsLoading]=useState(false);
  const [bookings,setBookings]=useState([]);
  
  const authContext = useContext(AuthContext);

  const handleCancelBooking = async(bookingId)=>{
    setIsLoading(true);

    const reqBody = {
      query: `
        mutation($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
      setIsLoading(false);
    } 
    catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);

    const reqBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
      
      setBookings(result.data.bookings);
      setIsLoading(false);

    } 
    catch (error) {
      console.log(error);
      setIsLoading(false);
    };
  }

  useEffect(()=>{
    if(!authContext.token) return;
    fetchBookings();
  },[authContext.token]);

  const bookingsList = useMemo(() => bookings.map(booking => (
    <BookingItem
      key={booking._id}
      id={booking._id}
      title={booking.event.title}
      createdAt={booking.createdAt}
      onDelete={handleCancelBooking}
    />
  )), [bookings, handleCancelBooking]);

  return (
    <>
      {isLoading?
      <LoadingSpinner/>:
      <section className="event-list">
        <p className="booking-p">Your Bookings</p>
        <ul className="events-ul">
          {bookingsList}
        </ul>
      </section>}
    </>
  )
}

export default BookingsPage