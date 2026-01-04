import moment from 'moment-jalaali';
moment.loadPersian({dialect: 'persian-modern', usePersianDigits: true});

const formatJalaliDate = (date: string | Date) => {
    return moment(date).format('dddd jD jMMMM jYYYY');
};

const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');

    return hrs > 0
        ? `${hrs}:${paddedMins}:${paddedSecs}`
        : `${paddedMins}:${paddedSecs}`;
}

export {formatJalaliDate, formatTime}
