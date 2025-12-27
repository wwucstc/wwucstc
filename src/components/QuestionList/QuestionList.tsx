import React from 'react';
import type { Ticket } from '../../types';
import QuestionListItem from '../QuestionListItem/QuestionListItem';

interface QuestionListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

const QuestionList: React.FC<QuestionListProps> = ({ tickets, onSelectTicket, selectedTicket }) => {
  return (
    <div className="w-1/3 border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-bold">Questions</h2>
      </div>
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 64px)' }}>
        {tickets.map((ticket) => (
          <QuestionListItem
            key={ticket._id}
            ticket={ticket}
            onSelectTicket={onSelectTicket}
            isSelected={selectedTicket?._id === ticket._id}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
