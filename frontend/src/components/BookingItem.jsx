
function BookingItem(props) {
  return (
    <li className="booking-item">
      <div>
        <h2 className="event-title">{props.title}</h2>
        <p className="event-price-date">{new Date(props.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="event-details">
        <button className="btn-view-event btn-cancel" onClick={props.onDelete.bind(this, props.id)}>Cancel</button>
      </div>
    </li>
  )
}

export default BookingItem