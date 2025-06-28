const groupSlots = (slots, duration) => {
  const durationValue = duration === "1.5 hr" ? 1.5 : 1;
  const getDuration = (slot) => {
    const [sh, sm] = slot.startTime.split(":" ).map(Number);
    const [eh, em] = slot.endTime.split(":" ).map(Number);
    return eh + em / 60 - (sh + sm / 60);
  };

  return {
    morningAfternoon: slots.filter((s) => {
      const dur = getDuration(s);
      return dur === durationValue && s.startTime >= "06:00" && s.endTime <= "16:00";
    }),
    evening: slots.filter((s) => {
      const dur = getDuration(s);
      return dur === durationValue && s.startTime >= "16:00" && s.endTime <= "24:00";
    }),
  };
};
export default groupSlots;