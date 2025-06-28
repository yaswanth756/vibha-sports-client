import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, Sunrise, Sunset } from "lucide-react";
import moment from 'moment';
import formatTimeRange from '../../utils/timeConverter';
import groupSlots from '../../utils/groupSlots';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;



const SkeletonSlot = () => (
  <div className="px-4 py-2 rounded-xl bg-gray-100 animate-pulse flex items-center gap-2 w-48 h-16">
    <div className="w-5 h-5 bg-gray-300 rounded-full" />
    <div className="w-20 h-4 bg-gray-300 rounded" />
  </div>
);

// SlotSection Component
const SlotSection = ({ title, icon, slots, loading, selectedSlots, onSelect, selectedDate }) => {
  const scrollRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    setShowScrollHint(slots.length > 4);
  }, [slots]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollHint(el.scrollLeft < 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const isToday = new Date(selectedDate).toDateString() === new Date().toDateString();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-6 flex items-center">
        <span className="mr-2">{icon}</span> {title}
      </h2>

      {/* Show message if no slots and it's today */}
      {!loading && slots.length === 0 && isToday && (
        <div className="bg-red-100 text-red-800 border border-red-300 p-4 rounded-lg text-sm mb-4">
          All slots before the current time are unavailable. Please select a future slot or another date.
        </div>
      )}

      {!loading && slots.length === 0 && !isToday && (
        <div className="bg-spring-leaves-100 text-spring-leaves-500 border p-4 rounded-lg text-sm mb-4">
          No slots available for this date.
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex flex-row gap-3 overflow-x-auto overflow-y-hidden scrollbar-thumb-gray-400 scrollbar-track-gray-100 pb-4 hide-scrollbar"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonSlot key={i} />)
            : slots.map((slot) => {
                const isSelected = selectedSlots.some((s) => s._id === slot._id);
                return (
                  <div
                    key={slot._id}
                    onClick={() => onSelect(slot)}
                    className={`border rounded-lg px-4 py-2 text-center shadow-sm flex-shrink-0 w-48 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-spring-leaves-500 text-white border-spring-leaves-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <p className="font-medium">
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </p>
                    <p className="text-xs">{slot.type}</p>
                  </div>
                );
              })}
        </div>

        {!loading && slots.length > 4 && showScrollHint && (
          <div className="absolute bottom-0 right-0 w-12 h-full bg-gradient-to-l from-spring-leaves-200 to-transparent pointer-events-none flex items-center justify-center">
            <ArrowRight className="text-spring-leaves-600" size={16} />
          </div>
        )}
      </div>
    </div>
  );
};


// Main Component

const AvailableSlots = ({ selectedDate, courtName, slotType, setSelectedSlots, selectedSlots,refresh }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('AvailableSlots props:', { selectedDate, courtName, slotType, selectedSlots });

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      // Parse selectedDate and format to YYYY-MM-DD
      const formattedDate = moment(selectedDate, 'ddd MMM DD YYYY').format('YYYY-MM-DD');
      console.log('Fetching slots for:', { formattedDate, courtName, slotType });

      const url = `${BACKEND_API}/api/slots/available?date=${formattedDate}&court=${encodeURIComponent(
        courtName
      )}&type=${encodeURIComponent(slotType)}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setSlots(data || []);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchSlots();
  }, [selectedDate, courtName, slotType,refresh]);

  const handleSlotSelect = (slot) => {
    const alreadySelected = selectedSlots.some((s) => s._id === slot._id);

    if (alreadySelected) {
      setSelectedSlots(selectedSlots.filter((s) => s._id !== slot._id));
    } else {
      if (selectedSlots.length > 0 && selectedSlots[0].type !== slot.type) {
        alert(`You can't mix ${selectedSlots[0].type} and ${slot.type} slots`);
        return;
      }
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const grouped = groupSlots(slots, slotType);

  return (
    <div className="mt-8">
      <SlotSection
        title="Morning / Afternoon (6:00 AM - 4:00 PM)"
        icon={<Sunrise className="text-spring-leaves-500" />}
        slots={grouped.morningAfternoon}
        loading={loading}
        selectedSlots={selectedSlots}
        onSelect={handleSlotSelect}
      />
      <SlotSection
        title="Evening (4:00 PM - 11:30:00 PM)"
        icon={<Sunset className="text-spring-leaves-500" />}
        slots={grouped.evening}
        loading={loading}
        selectedSlots={selectedSlots}
        onSelect={handleSlotSelect}
      />
    </div>
  );
};


export default AvailableSlots;