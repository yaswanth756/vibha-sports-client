import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import LoginForm from './LoginForm';

const LoginSignupModel = ({ isModelOpen, setModelOpen }) => {
  return (
    <Transition show={isModelOpen} as={Fragment}>
      <Dialog onClose={() => setModelOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative flex flex-col sm:flex-row bg-white shadow-lg w-full max-w-md sm:max-w-3xl mx-auto">
              <div className="hidden sm:block w-full sm:w-1/2">
                <img
                  src="https://ik.imagekit.io/jezimf2jod/sports.png?updatedAt=1750828520689"
                  alt="Sports"
                  className="h-full w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                />
              </div>
              <div className="flex items-center justify-center w-full sm:w-1/2 p-2 sm:p-4">
                <LoginForm setModelOpen={setModelOpen} />
              </div>
              <button
                onClick={() => setModelOpen(false)}
                className="absolute top-2 right-2 text-spring-leaves-600 text-lg sm:text-2xl font-bold h-6 w-6"
              >
                ×
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginSignupModel;
