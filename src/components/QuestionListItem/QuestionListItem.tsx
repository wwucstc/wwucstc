import React from 'react';
import type { Ticket } from '../../types';

interface QuestionListItemProps {
  ticket: Ticket;
  onSelectTicket: (ticket: Ticket) => void;
  isSelected: boolean;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({ ticket, onSelectTicket, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Complete': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <button
      onClick={() => onSelectTicket(ticket)}
      className={`w-full text-left p-4 border-b border-gray-200 ${
        isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">{ticket.studentName}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>
    </button>
  );
};

export default QuestionListItem;
