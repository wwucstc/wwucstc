import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import QuestionList from '../QuestionList/QuestionList';
import QuestionDetails from '../QuestionDetails/QuestionDetails';
import type { Ticket, TicketUpdateEvent } from '../../types';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-6 px-6 md:px-10">
          <h2 className="text-3xl font-bold text-gray-900">Hi {username}</h2>
          <div className="flex gap-4 items-center">
             <div className="flex items-center text-sm bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Connected
             </div>
             <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Log Out
             </button>
          </div>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        
        <div className="flex border border-gray-200 rounded-lg bg-white shadow-lg" style={{ height: 'calc(100vh - 120px)' }}>
          <QuestionList tickets={tickets} onSelectTicket={handleSelectTicket} selectedTicket={selectedTicket} />
          <QuestionDetails ticket={selectedTicket} handleClaim={handleClaim} />
        </div>
      </div>
    </div>
  );
}