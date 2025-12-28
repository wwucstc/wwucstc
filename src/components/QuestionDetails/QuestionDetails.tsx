import React from 'react';
import type { Ticket } from '../../types';
import './QuestionDetails.css'

interface QuestionDetailsProps {
  ticket: Ticket | null;
  handleClaim: (ticketId: string) => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ ticket, handleClaim }) => {
  if (!ticket) {
    return (
      <div className="question-details-container">
        <div className="no-question-selected">
          Select a question to see the details.
        </div>
      </div>
    );
  }

  return (
    <div className="question-details-container">
      <div className="question-details-card">
        <div className="question-details-header">
          <div className="student-info">
            <span className="student-name">{ticket.studentName}</span>
            <span className="class-name">for {ticket.className}</span>
          </div>
          <div className="timestamp">
            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="question-details-body">
          <p className="problem-description">{ticket.problem}</p>
          <p className="problem-description">Steps Taken: {ticket.stepsTaken}</p>
          {ticket.status === 'New' ? (
            <button onClick={() => handleClaim(ticket._id)} className="claim-button">
              Claim Ticket
            </button>
          ) : (
            <span className="claimed-by">Claimed by {ticket.claimedBy}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
