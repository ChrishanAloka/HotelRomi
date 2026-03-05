import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingCalendar({ bookings, onBookingClick }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const calendarDays = [];

    // Fill previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevMonthLastDay - i,
            month: month - 1,
            year: year,
            isCurrentMonth: false
        });
    }

    // Fill current month days
    for (let i = 1; i <= lastDayOfMonth; i++) {
        calendarDays.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }

    // Fill next month days
    const totalSlots = 42; // 6 rows of 7 days
    const remainingSlots = totalSlots - calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
        calendarDays.push({
            day: i,
            month: month + 1,
            year: year,
            isCurrentMonth: false
        });
    }

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const isToday = (d, m, y) => {
        const today = new Date();
        return today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
    };

    const getBookingsForDay = (d, m, y) => {
        const date = new Date(y, m, d);
        date.setHours(0, 0, 0, 0);

        return bookings.filter(b => {
            const start = new Date(b.checkIn);
            const end = new Date(b.checkOut);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return date >= start && date <= end;
        });
    };

    return (
        <div className="calendar-container animate-in">
            <div className="calendar-header">
                <div className="d-flex align-items-center gap-3">
                    <h4 className="mb-0 text-gold-shimmer" style={{ minWidth: '180px' }}>
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h4>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-gold" onClick={prevMonth}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-gold px-3" onClick={goToday}>
                        Today
                    </button>
                    <button className="btn btn-sm btn-outline-gold" onClick={nextMonth}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                {DAYS.map(day => (
                    <div key={day} className="calendar-day-label">{day}</div>
                ))}

                {calendarDays.map((item, index) => {
                    const dayBookings = getBookingsForDay(item.day, item.month, item.year);
                    const isTodayCell = isToday(item.day, item.month, item.year);

                    return (
                        <div
                            key={index}
                            className={`calendar-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isTodayCell ? 'today' : ''} ${dayBookings.length === 0 ? 'no-bookings' : ''}`}
                        >
                            <div className="calendar-day-number">{item.day}</div>
                            <div className="d-flex flex-column gap-1">
                                {dayBookings.slice(0, 3).map(b => (
                                    <div
                                        key={b._id}
                                        className={`booking-pill booking-pill-${b.status.toLowerCase()}`}
                                        onClick={() => onBookingClick(b)}
                                    >
                                        <span className="fw-600">{b.customerName}</span>
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div
                                        className="text-muted text-center"
                                        style={{ fontSize: '0.65rem', cursor: 'pointer' }}
                                        onClick={() => onBookingClick(dayBookings[0])} // Just a fallback
                                    >
                                        + {dayBookings.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
