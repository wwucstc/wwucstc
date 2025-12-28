import React from 'react';
import type { Ticket } from '../../types';
import QuestionListItem from '../QuestionListItem/QuestionListItem';
import './QuestionList.css'

interface QuestionListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

const QuestionList: React.FC<QuestionListProps> = ({ tickets, onSelectTicket, selectedTicket }) => {
  return (
    <div className="question-list-container">
      <div className="question-list-header">
        <h2 className="question-list-title">Questions</h2>
      </div>
      <div className="question-list" style={{ height: 'calc(100% - 64px)' }}>
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
