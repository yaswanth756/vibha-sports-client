const formatTimeRange = (startTime, endTime) => {
    const [h1, m1] = startTime.split(":" ).map(Number);
    const [h2, m2] = endTime.split(":" ).map(Number);
  
    const startAmPm = h1 >= 12 ? "PM" : "AM";
    const endAmPm = h2 >= 12 ? "PM" : "AM";
  
    const startHour = h1 % 12 || 12;
    const endHour = h2 % 12 || 12;
  
    const startMinutes = m1 === 0 ? "" : `:${m1.toString().padStart(2, "0")}`;
    const endMinutes = m2 === 0 ? "" : `:${m2.toString().padStart(2, "0")}`;
  
    if (startAmPm === endAmPm) {
      return `${startHour}${startMinutes} - ${endHour}${endMinutes} ${endAmPm}`;
    } else {
      return `${startHour}${startMinutes} ${startAmPm} - ${endHour}${endMinutes} ${endAmPm}`;
    }
  };
export default formatTimeRange;