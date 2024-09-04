import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { createEventId } from '../event-utils'
import dayjs from 'dayjs'
import CloseIcon from '@mui/icons-material/Close';
import './CalendraCreateEventPopup.css'



export default function CalendraCreateEventPopup({ selectInfo, elementInfo, visibility, handlePopupVisibility, edit }) {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [position, setPosition] = useState({ top: '0px', left: '0px' });

    useEffect(() => {
        setDate(selectInfo?.startStr);
        setPosition({
            top: `${elementInfo?.dayEl.getBoundingClientRect().y + elementInfo?.dayEl.offsetHeight * 0.75}px`,
            left: `${elementInfo?.dayEl.getBoundingClientRect().x}px`
        })
        setTitle(selectInfo?.title ? selectInfo.title : '');
        setStartTime(dayjs(selectInfo?.start));
    }, [selectInfo, elementInfo])

    function onTitleChange(value) {
        if (value.length <= 30) {
            setTitle(value);
        }
    }

    function handleCreateButtonClick() {
        let eventInfo = {}

        if (title && date && startTime) {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect() // clear date selection
            eventInfo = {
                id: createEventId(),
                title: title,
                start: `${date}${/T.*$/.exec(startTime?.toISOString())}`,
                end: `${date}${/T.*$/.exec(startTime?.add(30, 'minute').toISOString())}`,
                backgroundColor: 'red',
                textColor: '#fff',
                allDay: false
            }
            calendarApi.addEvent(eventInfo);
            handleClosePopup(false);
            reset();
        } else {
            return;
        }
    }

    function handleSaveButtonClick() {
        selectInfo.setProp('title', title);
        selectInfo.setDates(`${date}${/T.*$/.exec(startTime?.toISOString())}`, `${date}${/T.*$/.exec(startTime?.add(30, 'minute').toISOString())}`);
    }

    function handleClosePopup(value) {
        handlePopupVisibility(value);
    }

    function onCloseButtonClick() {
        handleClosePopup(false);
        reset();
    }

    function onDiscardButtonClick() {
        selectInfo.remove();
        handleClosePopup(false);
        reset();
    }

    function reset() {
        setTitle('');
        setNotes('');
        setDate(null);
        setStartTime(null);
    }

    return (
        <div className="calendar-create-event-popup" style={{
            top: position.top,
            left: position.left,
            display: !visibility ? 'none' : ''
        }}>
            <IconButton
                sx={{ position: 'absolute', top: '5px', right: '5px' }}
                color="primary"
                onClick={() => {
                    onCloseButtonClick();
                }}
            >
                <CloseIcon fontSize='small'></CloseIcon>
            </IconButton>
            <TextField label="event name" sx={{ marginBottom: '20px' }} value={title} onChange={((event) => { onTitleChange(event.target.value) })}></TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Event date"
                    sx={{ marginBottom: '20px' }}
                    value={dayjs(date)}
                    onChange={(value) => {
                        setDate(value?.format().replace(/T.*$/, ''))
                    }}
                />
                <TimePicker label="Event time"
                    ampm={false}
                    minTime={dayjs().set('hour', 7)}
                    maxTime={dayjs().set('hour', 18)}
                    minutesStep={30}
                    skipDisabled
                    value={dayjs(startTime)}
                    onChange={(value) => {
                        setStartTime(value);
                    }}
                    sx={{ marginBottom: '20px' }}
                />
            </LocalizationProvider>

            <TextField label="notes" sx={{ marginBottom: '20px' }} onChange={((event) => { setNotes(event.target.value); })}></TextField>

            <div className='calendar-create-event-popup__buttons-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onDiscardButtonClick} sx={{ color: '#FF5F5F', display: edit ? '' : 'none' }}>Discard</Button>
                <Button onClick={onCloseButtonClick} sx={{ color: '#FF5F5F', display: edit ? 'none' : '' }}>Cancel</Button>
                <Button onClick={handleCreateButtonClick} sx={{ display: edit ? 'none' : '' }}>Create</Button>
                <Button onClick={handleSaveButtonClick} sx={{ display: edit ? '' : 'none' }}>Save</Button>
            </div>
        </div >
    )
}