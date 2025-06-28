// BookingForm.jsx
import { useEffect, useState, useRef } from "react";
import { Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import AvailableSlots from "./AvailableSolts";
import BookingSummary from "./BookingSummary";
import Dates from "./Dates";
import { useAuth } from "../context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Confetti from "react-confetti";
const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const BookingForm = ({setModelOpen }) => {
  const today = new Date().toDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slotType, setslotType] = useState("1 hr");
  const [courtName, setCourtName] = useState("Court A");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const { user } = useAuth();
  const confettiRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSelectedSlots([]);
  }, [selectedDate, courtName, slotType]);

  useEffect(() => {
    if (success && confettiRef.current) {
      const { offsetWidth, offsetHeight } = confettiRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [success]);

  const hanldeProceedBooking = () => {
    if (!user) {
      setModelOpen(true);
      return;
    }
    setShowModal(true);
  };

  const handleBooking = async () => {
    if (!user) {
      setModelOpen(true);
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_API}/api/bookings/createbooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${localStorage.getItem("token")}` },
       
        body: JSON.stringify({
          userId: user.id,
          selectedSlots,
          bookingDate: selectedDate,
          court: courtName,
          type: slotType,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setRefresh(!refresh);
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-spring-leaves-50 py-10 px-4" id="booknow">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-medium text-gray-900">Book Your Cricket Slot</h1>
        <p className="text-gray-600 mt-1">Select your preferred time slot for box cricket.</p>
      </div>

      <Dates selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <div className="mx-auto max-w-5xl w-full bg-white mt-8 rounded-lg shadow-md p-6">
  {/* Header Row - Flex wraps on small screens */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Icon + Title */}
              <div className="flex items-center space-x-2 min-w-[200px]">
                <Clock className="text-spring-leaves-500" />
                <h1 className="text-lg font-medium text-gray-900">Available Time Slots</h1>
              </div>

              {/* Courts + Duration Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Court Buttons */}
                {["Court A", "Court B"].map((court) => (
                  <button
                    key={court}
                    className={`border rounded-md w-20 h-10 text-sm ${
                      courtName === court
                        ? "bg-spring-leaves-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setCourtName(court)}
                  >
                    {court}
                  </button>
                ))}

                {/* Slot Type Buttons */}
                {["1 hr", "1.5 hr"].map((type) => (
                  <button
                    key={type}
                    className={`border rounded-md w-20 h-10 text-sm ${
                      slotType === type
                        ? "bg-spring-leaves-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setslotType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

  {/* Slots */}
            <AvailableSlots
              selectedDate={selectedDate}
              courtName={courtName}
              slotType={slotType}
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              refresh={refresh}
            />

            {/* Summary */}
            <BookingSummary
              selectedDate={selectedDate}
              selectedSlots={selectedSlots}
              slotType={slotType}
              courtName={courtName}
              setTotalPrice={setTotalPrice}
            />

            {/* Proceed Button */}
            <div className="mt-6">
              <button
                disabled={selectedSlots.length === 0}
                className="bg-spring-leaves-500 text-white px-6 py-2 w-full rounded-sm flex justify-center items-center gap-3 hover:bg-spring-leaves-600 transition-all duration-300"
                onClick={hanldeProceedBooking }
              >
                <p>Proceed Booking</p>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
      </div>


      {/* Modal */}
      <Transition show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                {success ? (
                  <div ref={confettiRef} className="relative text-center">
                    <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={150} recycle={false} />
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-green-600 mb-2">Booking Successful!</h2>
                    <p className="text-sm text-gray-700">
                      Your slots have been booked successfully. Please pay at the reception and arrive on time.
                    </p>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedSlots([]);
                        setSuccess(false);
                      }}
                      className="mt-4 bg-spring-leaves-500 text-white px-4 py-2 rounded-sm hover:bg-spring-leaves-600 transition"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-center"
                    >
                      Confirm Your Booking
                    </Dialog.Title>
                    <div className="mt-2 text-sm text-gray-600 space-y-7 py-6">
                      <p>Date: {selectedDate}</p>
                      <p>Court: {courtName}</p>
                      <p>Duration: {slotType}</p>
                      <p>Slots Selected: {selectedSlots.length}</p>
                      <p>Total: ₹{totalPrice}</p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={handleBooking}
                        className="w-full bg-spring-leaves-500 text-white py-2 rounded hover:bg-spring-leaves-600 transition"
                      >
                        {isLoading ? "Booking..." : "Confirm Booking"}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="mt-3 w-full text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BookingForm;




