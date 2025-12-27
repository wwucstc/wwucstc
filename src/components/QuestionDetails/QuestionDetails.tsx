import React from 'react';
import type { Ticket } from '../../types';

interface QuestionDetailsProps {
  ticket: Ticket | null;
  handleClaim: (ticketId: string) => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ ticket, handleClaim }) => {
  if (!ticket) {
    return (
      <div className="w-2/3 p-6">
        <div className="text-center text-gray-500">
          Select a question to see the details.
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-6">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">{ticket.studentName} </span>
            <span className="text-gray-400 text-sm"> for {ticket.className}</span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-800 bg-gray-50 p-3 rounded mb-2">{ticket.problem}</p>
          <p className="text-gray-800 bg-gray-50 p-3 rounded mb-2">Steps Taken: {ticket.stepsTaken}</p>
          {ticket.status === 'New' ? (
            <button onClick={() => handleClaim(ticket._id)} className="bg-blue-600 text-white px-4 py-2 rounded">
              Claim Ticket
            </button>
          ) : (
            <span className="text-gray-500 italic">Claimed by {ticket.claimedBy}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
