import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS } from './event-utils'
import './Calendar.css'
import CalendraCreateEventPopup from './CalendraCreateEventPopup/CalendraCreateEventPopup'

export default function Calendar() {
    const [currentEvents, setCurrentEvents] = useState([])
    const [selectInfo, setSelectInfo] = useState(null);
    const [clickInfo, setClickInfo] = useState(null);
    const [popupVisibility, setPopupVisibility] = useState(false);
    const [popupEdit, setPopupEdit] = useState(false);

    function handleDateSelect(selectInfo) {
        setSelectInfo(selectInfo);
        setPopupVisibility(true);
        setPopupEdit(false);
    }

    function handleDateClick(info) {
        setClickInfo(info);
    }

    function handleEventClick(clickInfo) {
        setPopupEdit(true);
        setPopupVisibility(true);
        setSelectInfo(clickInfo.event);

    }

    function handleEvents(events) {
        setCurrentEvents(events);
    }


    function handleVisibilityChange(value) {
        setPopupVisibility(value);
    }

    return (
        <div className='calendar'>
            <CalendraCreateEventPopup selectInfo={selectInfo} elementInfo={clickInfo} visibility={popupVisibility} handlePopupVisibility={handleVisibilityChange} edit={popupEdit}></CalendraCreateEventPopup>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='dayGridMonth'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                dateClick={handleDateClick}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            />
        </div>
    )
}

function renderEventContent(eventInfo) {
    return (
        <>
            <i>{eventInfo.event.title}</i>
        </>
    )
}
