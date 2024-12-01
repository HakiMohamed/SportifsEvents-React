// src/pages/EventForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EventsApi, { CreateEventDto } from '../services/eventsApi';
import { motion, AnimatePresence } from 'framer-motion';

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<CreateEventDto>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      const event = await EventsApi.getEventById(id!);
      
      setValue('name', event.name);
      setValue('description', event.description);
      setValue('date', new Date(event.date).toISOString().split('T')[0]);
      setValue('location', event.location);
      setValue('maxParticipants', event.maxParticipants);
    } catch (error) {
      toast.error('Unable to load event details', {
        position: 'bottom-right',
        theme: 'colored'
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateEventDto) => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        await EventsApi.updateEvent(id!, data);
        toast.success('Event updated successfully', {
          position: 'bottom-right',
          theme: 'colored'
        });
      } else {
        await EventsApi.createEvent(data);
        toast.success('Event created successfully', {
          position: 'bottom-right', 
          theme: 'colored'
        });
      }
      navigate('/events');
    } catch (error) {
      toast.error(isEditMode 
        ? 'Unable to update event'
        : 'Unable to create event',
        {
          position: 'bottom-right',
          theme: 'colored'
        }
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <motion.div 
        className="w-full  bg-white p-8 backdrop-blur-lg bg-opacity-95"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h1 
          className="text-4xl text-center font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          {isEditMode ? 'Edit Event' : 'Create Event'}
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="group">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
              Event Name
            </label>
            <div className="relative">
              <input 
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                placeholder="Ex: Annual Conference"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="group">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
              Description
            </label>
            <textarea 
              id="description"
              {...register('description', { required: 'Description is required' })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
              placeholder="Describe your event"
              rows={5}
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="group">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
              Event Date
            </label>
            <input 
              type="date"
              id="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
            />
            <AnimatePresence>
              {errors.date && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.date.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="group">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
              Location
            </label>
            <input 
              type="text"
              id="location"
              {...register('location', { required: 'Location is required' })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
              placeholder="Ex: Conference Room, London"
            />
            <AnimatePresence>
              {errors.location && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.location.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="group">
            <label htmlFor="maxParticipants" className="block text-gray-700 font-medium mb-2 transition group-hover:text-blue-600">
              Maximum number of participants
            </label>
            <input 
              type="number"
              id="maxParticipants"
              {...register('maxParticipants', { 
                required: 'Number of participants is required',
                min: { value: 1, message: 'Minimum 1 participant' },
                valueAsNumber: true
              })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
              placeholder="Ex: 50"
            />
            <AnimatePresence>
              {errors.maxParticipants && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.maxParticipants.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 pt-8">
            <motion.button 
              type="submit"
              disabled={isLoading || isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-4 rounded-xl font-medium text-lg transition-all duration-300
                ${isLoading || isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                }
              `}
            >
              {isLoading || isSubmitting
                ? <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                : (isEditMode ? 'Update Event' : 'Create Event')}
            </motion.button>
            <motion.button 
              type="button"
              onClick={() => navigate('/events')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-lg"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
   
  );
};

export default EventForm;