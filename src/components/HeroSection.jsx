import { CalendarClock, Users, ArrowRightCircle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const HeroSection = ({ setModelOpen }) => {
  const { user } = useAuth();

  const handleLoginClick = (e) => {
    if (!user) {
      e.preventDefault(); // stop scroll
      setModelOpen(true); // open modal
    } else {
      // scroll to #booknow smoothly
      const section = document.getElementById("booknow");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-spring-leaves-600 text-white h-[450px] flex items-center justify-center px-6 md:px-20">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-4xl font-medium tracking-tight">
          Book <span className="text-white">.</span> Play <span className="text-white-400">.</span> Enjoy.
        </h1>
        <p className="text-gray-100 text-base md:text-lg">
          Experience the thrill of box cricket with seamless booking, top-notch turfs, and unbeatable vibes.
        </p>

        <div className="flex justify-center gap-8 flex-wrap mt-4 text-spring-leaves-50">
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-5 h-5" />
            <span>Easy Booking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Up & Play</span>
          </div>
        </div>

        {/* Button that checks login and scrolls or opens modal */}
        <a href="#booknow" onClick={handleLoginClick}>
          <button className="mt-6 inline-flex items-center px-6 py-3 bg-white hover:bg-spring-leaves-100 text-spring-leaves-800 font-semibold rounded-md transition">
            Book Your Slot Now
            <ArrowRightCircle className="ml-2 w-5 h-5" />
          </button>
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
