import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import QuestionList from '../QuestionList/QuestionList';
import QuestionDetails from '../QuestionDetails/QuestionDetails';
import type { Ticket, TicketUpdateEvent } from '../../types';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial Fetch (still needed for the first load)
  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const fetchedTickets = await res.json();
        setTickets(fetchedTickets);
        if (fetchedTickets.length > 0) {
          setSelectedTicket(fetchedTickets[0]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tutorToken');
    const storedName = localStorage.getItem('tutorName');
    
    if (!token) { navigate('/login'); return; }
    if (storedName) setUsername(storedName);

    fetchTickets();
  }, [navigate]);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY!, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'us3',
    });

    const channel = pusher.subscribe('tutor-dashboard');

    channel.bind('ticket-added', (newTicket: Ticket) => {
      setTickets((prev) => [newTicket, ...prev]);
    });

    channel.bind('ticket-updated', (data: TicketUpdateEvent) => {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === data.ticketId
            ? { ...ticket, status: data.status, claimedBy: data.claimedBy }
            : ticket
        )
      );
      setSelectedTicket((prevSelected) =>
        prevSelected?._id === data.ticketId
          ? { ...prevSelected, status: data.status, claimedBy: data.claimedBy }
          : prevSelected
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tutorToken');
    localStorage.removeItem('tutorName');
    navigate('/login');
  };

  const handleClaim = async (ticketId: string) => {
    const token = localStorage.getItem('tutorToken');
    if (!token) return;

    await fetch('/api/claim', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ ticketId }),
    });
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Hi {username}</h2>
          <div className="header-actions">
             <button onClick={handleLogout} className="logout-button">
                Log Out
             </button>
          </div>
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        
        <div className="dashboard-main">
          <QuestionList tickets={tickets} onSelectTicket={handleSelectTicket} selectedTicket={selectedTicket} />
          <QuestionDetails ticket={selectedTicket} handleClaim={handleClaim} />
        </div>
      </div>
    </div>
  );
}