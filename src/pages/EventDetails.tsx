// src/pages/EventDetails.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventsApi, { Event } from '../services/eventsApi';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import ManageParticipants from './ManageParticipants';

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showManageParticipants, setShowManageParticipants] = useState(false);
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const manageParticipantsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      if (eventId) {
        const fetchedEvent = await EventsApi.getEventById(eventId);
        setEvent(fetchedEvent);
      }
    } catch (error: unknown) {
      toast.error('Failed to load event details');
      console.error(error);
      navigate('/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (eventId) {
        await EventsApi.downloadParticipantReport(eventId);
        toast.success('Report downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download report');
      console.error(error);
    }
  };

  const handleParticipantAdded = () => {
    fetchEventDetails();
  };

  const handleRemoveParticipant = async (participantEmail: string) => {
    try {
      if (eventId) {
        await EventsApi.removeParticipant(eventId, participantEmail);
        toast.success('Participant removed successfully');
        fetchEventDetails();
      }
    } catch (error) {
      toast.error('Failed to remove participant');
      console.error(error);
    }
  };

  const handleManageParticipantsClick = () => {
    setShowManageParticipants(!showManageParticipants);
    if (!showManageParticipants && manageParticipantsRef.current) {
      setTimeout(() => {
        manageParticipantsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-600">Event not found</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-lg backdrop-filter p-4 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            {event.name}
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/events')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors self-end sm:self-auto"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleManageParticipantsClick}
              className="w-full sm:w-auto group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {showManageParticipants ? 'Hide Management' : 'Manage Participants'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadReport}
              className="w-full sm:w-auto group relative bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm"
          >
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base"><strong>Description:</strong> {event.description}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center space-x-3 bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Date</p>
                <p className="font-semibold text-sm sm:text-base text-gray-700">{formatDate(event.date)}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center space-x-3 bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Location</p>
                <p className="font-semibold text-sm sm:text-base text-gray-700">{event.location}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center space-x-3 bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-violet-100 p-3 rounded-full">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Participants</p>
                <p className="font-semibold text-sm sm:text-base text-gray-700">{event.participants?.length || 0} / {event.maxParticipants}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showManageParticipants && (
            <motion.div
              ref={manageParticipantsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white/90 backdrop-blur-lg   p-2 sm:p-8 w-full w-full  overflow-y-auto shadow-2xl border border-white/20"
              >
                <div className="flex justify-between items-center mb-6">
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleManageParticipantsClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <ManageParticipants 
                  eventId={eventId!} 
                  maxParticipants={event.maxParticipants}
                  currentParticipants={event.participants || []}
                  onParticipantAdded={handleParticipantAdded}
                  onRemoveParticipant={handleRemoveParticipant}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {event.participants && event.participants.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 sm:mt-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Participants List</h2>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Full Name</th>
                        <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Email</th>
                        <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Phone</th>
                        <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {event.participants.map((participant, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 font-medium">{participant.fullName}</td>
                          <td className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{participant.email}</td>
                          <td className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{participant.phone || 'N/A'}</td>
                          <td className="whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                            {participant.registrationDate 
                              ? new Date(participant.registrationDate).toLocaleDateString() 
                              : 'N/A'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EventDetails;