import { useEffect, useState } from "react";
import formatTimeRange from "../../utils/timeConverter";
const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const BookingSummary = ({ selectedDate, selectedSlots, slotType, courtName,setTotalPrice }) => {
  const [pricePerHour, setPricePerHour] = useState(0);

  useEffect(() => {
    const fetchCourtPrice = async () => {
      try {
        const res = await fetch(`${BACKEND_API}/api/courts`);
        const courts = await res.json();
        const court = courts.find(c => c.name === courtName);
        if (court) setPricePerHour(court.pricePerHour);
      } catch (error) {
        console.error("Error fetching court price:", error);
      }
    };

    if (courtName) fetchCourtPrice();
  }, [courtName]);

  const multiplier = slotType === "1.5 hr" ? 1.5 : 1;
  const totalPrice =
    selectedSlots?.length && pricePerHour
      ? selectedSlots.length * pricePerHour * multiplier
      : 0;
  setTotalPrice(totalPrice);
  return (
    <div className="bg-gray-50 p-6 rounded-md mt-6">
      <h1 className="font-semibold text-lg mb-4">Booking Summary</h1>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <p className="font-semibold text-gray-600">Date:</p>
          <p>{selectedDate ? new Date(selectedDate).toDateString() : "Not selected"}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold text-gray-600">Court:</p>
          <p>{courtName || "Not selected"}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold text-gray-600">Slot Type:</p>
          <p>{slotType || "Not selected"}</p>
        </div>

        <div className="flex justify-between">
        <p className="font-semibold text-gray-600">Slot Timings:</p>
        <div className="text-right flex flex-wrap gap-x-1">
          {selectedSlots?.length > 0 ? (
            selectedSlots.map((slot, index) => (
              <span key={slot._id} className="flex items-center bg-gray-200 px-2 py-1 rounded-md">
                {formatTimeRange(slot.startTime, slot.endTime)}
                {index < selectedSlots.length - 1 && <span className="text-gray-800 ml-1">,</span>}
                </span>
              ))
            ) : (
              <p>Not selected</p>
            )}
          </div>
</div>


        <hr className="my-2" />

        <div className="flex justify-between font-semibold text-base">
          <p>Total:</p>
          <p>₹{totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
