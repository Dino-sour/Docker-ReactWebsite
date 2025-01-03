import React, { useState } from "react";
import "./Events.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

const mockEvents = [
  { date: "2024-12-18", title: "Pool Party" },
  { date: "2024-12-22", title: "Tournament" },
  { date: "2024-12-25", title: "Practice Session" },
];

const Events = () => {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const upcomingEvents = [
    { title: "Pool Party", date: "Sun Nov 17 2024" },
    { title: "Tournament", date: "Thu Nov 21 2024" },
    { title: "Practice Session", date: "Sun Nov 24 2024" },
  ];

  const announcements = [
    "Tournament starts at 10 AM on Thu Nov 21 2024.",
    "Practice session moved to Sun Nov 24 2024 at 5 PM.",
    "Holiday hours will be announced soon!",
  ];

  const openModal = (contentType) => {
    setModalContent(contentType === "events" ? upcomingEvents : announcements);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="events-page">
      <div className="events-container">
        <header className="events-header">
          <h1>Stay in the loop</h1>
          <p>
            From weekly tournaments to special events, there’s always something
            happening at Hot Shot. Check out our calendar to see what’s coming
            up next.
          </p>
        </header>

        <div className="events-content">
          <div className="calendar-section">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="selected-date">
            <h3>Selected Date: {date.toDateString()}</h3>
          </div>

          <aside className="upcoming-events">
            <h3>Upcoming Events</h3>
            <ul>
              {upcomingEvents.map((event, index) => (
                <li key={index}>
                  <strong>{event.title}</strong>
                  <br />
                  {event.date}
                </li>
              ))}
            </ul>
            <button
              className="view-all-button"
              onClick={() => openModal("events")}
            >
              View all events &gt;
            </button>
          </aside>
        </div>
      </div>

      <footer className="events-footer">
        <div className="announcements-section">
          <h3>Announcements</h3>
          <ul>
            {announcements.map((announcement, index) => (
              <li key={index}>{announcement}</li>
            ))}
          </ul>
          <button
            className="view-all-button"
            onClick={() => openModal("announcements")}
          >
            View all announcements &gt;
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {modalContent === upcomingEvents
                ? "All Events"
                : "All Announcements"}
            </h3>
            <ul>
              {modalContent.map((item, index) => (
                <li key={index}>
                  {typeof item === "object" ? (
                    <>
                      <strong>{item.title}</strong>
                      <br />
                      {item.date}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
