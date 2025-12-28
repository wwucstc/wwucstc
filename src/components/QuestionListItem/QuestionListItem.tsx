import React from 'react';
import './QuestionListItem.css';
import type { Ticket } from '../../types';

interface QuestionListItemProps {
  ticket: Ticket;
  onSelectTicket: (ticket: Ticket) => void;
  isSelected: boolean;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({ ticket, onSelectTicket, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'In Progress': return 'status-in-progress';
      case 'Complete': return 'status-complete';
      default: return 'status-default';
    }
  };

  return (
    <button
      onClick={() => onSelectTicket(ticket)}
      className={`question-list-item ${isSelected ? 'selected' : ''}`}
    >
      <div className="item-content">
        <span className="item-student-name">{ticket.studentName}</span>
        <span className={`status-badge ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>
    </button>
  );
};

export default QuestionListItem;
