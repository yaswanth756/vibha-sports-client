import { Calendar,Clock } from 'lucide-react';

const Dates = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const maxDays = 4; // Number of days to show

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < maxDays; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const dates = getDates();

  return (
    <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md mx-auto md:max-w-5xl  mt-6">
      <div className="flex items-center mb-4 gap-2">
        <Calendar className="text-spring-leaves-500" />
        <span className="text-lg font-medium text-gray-900">Select Date</span>
      </div>

      <div className="flex justify-between overflow-x-auto w-full gap-2">
        {dates.map((date, index) => {
          const dateString = date.toDateString();
          const isSelected = selectedDate === dateString;

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(dateString)}
              className={`flex flex-col items-center justify-center w-full h-16 rounded-lg transition-all
                ${isSelected ? 'bg-spring-leaves-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="text-sm font-medium">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-base font-bold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dates;
