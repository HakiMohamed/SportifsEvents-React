// src/pages/ManageParticipants.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import EventsApi, { Participant, AddParticipantDto } from '../services/eventsApi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface ManageParticipantsProps {
  eventId: string;
  maxParticipants: number;
  currentParticipants: Participant[];
  onParticipantAdded: () => void;
  onRemoveParticipant: (email: string) => void;
}

const ManageParticipants: React.FC<ManageParticipantsProps> = ({
  eventId,
  maxParticipants,
  currentParticipants,
  onParticipantAdded,
  onRemoveParticipant
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddParticipantDto>();
  const [isTableView, setIsTableView] = useState(window.innerWidth >= 768);

  const onSubmit = async (data: AddParticipantDto) => {
    try {
      if (currentParticipants.length >= maxParticipants) {
        toast.error('Event has reached maximum capacity');
        return;
      }

      const participantExists = currentParticipants.some(
        participant => participant.email === data.email
      );

      if (participantExists) {
        toast.error('This participant is already registered');
        return;
      }

      await EventsApi.addParticipant(eventId, data);
      toast.success('Participant added successfully');
      onParticipantAdded();
      reset();
    } catch (error) {
      toast.error('Unable to add participant');
      console.error(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-white p-4 sm:p-8  shadow-lg"
    >
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Manage Participants
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
            Full Name
          </label>
          <input 
            {...register('fullName', { required: 'Full name is required' })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
            placeholder="John Doe"
          />
          <AnimatePresence>
            {errors.fullName && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {errors.fullName.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
            Email
          </label>
          <input 
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
            placeholder="john.doe@example.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
            Phone (Optional)
          </label>
          <input 
            {...register('phone')}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
            placeholder="+1 234 567 890"
          />
        </div>
        
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-base sm:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
        >
          Add Participant
        </motion.button>
      </form>

      <div className="mt-6 sm:mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Current Participants ({currentParticipants.length}/{maxParticipants})
          </h3>
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="text-blue-600 hover:text-blue-700 text-sm sm:text-base md:hidden"
          >
            {isTableView ? 'Card View' : 'Table View'}
          </button>
        </div>

        {/* Table View (Hidden on Mobile by Default) */}
        <div className={`hidden md:block overflow-x-auto rounded-xl shadow-sm`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentParticipants.map((participant, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{participant.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRemoveParticipant(participant.email)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div layout className="space-y-3 md:hidden">
          {currentParticipants.map((participant, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <p className="font-medium text-gray-800">{participant.fullName}</p>
                <p className="text-sm text-gray-600">{participant.email}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRemoveParticipant(participant.email)}
                className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Remove
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ManageParticipants;
