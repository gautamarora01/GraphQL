
function EventItem(props) {

  function executeClick(){
    props.onViewDetail.bind(this, props.eventId)();
  }

  return (
    <li key={props.eventId} className="event-item" onClick={executeClick}>
      <div>
        <h2 className="event-title">{props.title}</h2>
        <p className="event-price-date">${props.price} - {new Date(props.date).toLocaleDateString()}</p>
      </div>
      <div className="event-details">
        <button className="btn-view-event" onClick={executeClick}>View Details</button>
        {props.isCreator && <p className="event-creator">Created by you</p>}
      </div>
    </li>
  )
}

export default EventItem