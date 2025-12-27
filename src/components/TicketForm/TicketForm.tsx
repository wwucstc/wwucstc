import { useState } from 'react';
import type { FormEvent } from 'react';

export default function TicketForm() {
  // State for all the new fields
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [problem, setProblem] = useState('');
  const [stepsTaken, setStepsTaken] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const payload = {
      studentName: name,
      className: className,
      problem: problem,
      stepsTaken: stepsTaken
    };

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('Success! You are in the queue.');
        // Clear form
        setName('');
        setClassName('');
        setProblem('');
        setStepsTaken('');
      } else {
        setMessage('Error: Could not submit ticket.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error: Something went wrong.');
    }

    setIsSubmitting(false);
  };

  

    return (

      <div className="ticket-form-container">

        <h2 className="ticket-form-title">Get Help</h2>

        

        {message && (

          <div className={`message ${message.includes('Success') ? 'message-success' : 'message-error'}`}>

            {message}

          </div>

        )}

  

        <form onSubmit={handleSubmit} className="ticket-form">

          

          {/* Row 1: Name and Class */}

          <div className="form-grid">

            <div>

              <label className="form-label">Name</label>

              <input

                type="text"

                required

                value={name}

                onChange={(e) => setName(e.target.value)}

                className="form-input"

                placeholder="Your Name"

              />

            </div>

            <div>

              <label className="form-label">Class (e.g. CS 141)</label>

              <input

                type="text"

                required

                value={className}

                onChange={(e) => setClassName(e.target.value)}

                className="form-input"

                placeholder="Class Name"

              />

            </div>

          </div>

  

          {/* Row 2: Problem Description */}

          <div>

            <label className="form-label">What problem do you need help with?</label>

            <textarea

              required

              rows={3}

              value={problem}

              onChange={(e) => setProblem(e.target.value)}

              className="form-input"

              placeholder="Describe the bug or concept..."

            />

          </div>

  

          {/* Row 3: Steps Taken */}

          <div>

            <label className="form-label">What steps have you taken to solve it?</label>

            <textarea

              required

              rows={3}

              value={stepsTaken}

              onChange={(e) => setStepsTaken(e.target.value)}

              className="form-input"

              placeholder="I tried debugging using..."

            />

          </div>

  

          <button

            type="submit"

            disabled={isSubmitting}

            className="submit-button"

          >

            {isSubmitting ? 'Submitting...' : 'Join Queue'}

          </button>

        </form>

      </div>

    );

  }

  