function getDate(date, time) {
  // date: 2020-12-12 time: 12:00:00 return: 20201212T120000Z UTC+0
  let datetime = new Date(`${date}T${time}`);
  // 根据当前时区调整时间
  return datetime.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1) + 'Z';
}

function processEvent(activity) {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE-TIME:${getDate(activity.startDate,activity.startTime)}
DTEND;VALUE=DATE-TIME:${getDate(activity.endDate,activity.endTime)}
LOCATION:${activity.address}
DESCRIPTION:${activity.description}
SUMMARY:${activity.title}
END:VEVENT
`;
}

export function generateCalendar(activities) {
  let output = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
X-MS-OLK-FORCEINSPECTOROPEN:TRUE
`;
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    output += processEvent(activity);
  }
  output += 'END:VCALENDAR';
  return output;
}

export default { generateCalendar }