import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';

interface Ticket {
  _id: string;
  studentName: string;
  className: string;
  problem: string;
  stepsTaken: string;
  status: 'New' | 'In Progress' | 'Complete' | 'Closed' | 'Missed';
  createdAt: string;
  claimedBy: string | null;
  notes: string | null;
}
interface TicketUpdateEvent {
  ticketId: string;
  status: Ticket['status']; // Re-uses the status type from the Ticket interface
  claimedBy: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch (still needed for the first load)
  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        setTickets(await res.json());
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

    // --- PUSHER LIVE CONNECTION ---
    // PASTE YOUR KEY AND CLUSTER HERE
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY!, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'us3', // Fallback to 'us3' if variable missing
    });

    const channel = pusher.subscribe('tutor-dashboard');

    channel.bind('ticket-added', (newTicket: Ticket) => {
      // Add new ticket to top of list instantly
      setTickets((prev) => [newTicket, ...prev]);
    });

    channel.bind('ticket-updated', (data: TicketUpdateEvent) => {
      setTickets((prev) => prev.map(ticket => 
        ticket._id === data.ticketId 
          ? { ...ticket, status: data.status, claimedBy: data.claimedBy }
          : ticket
      ));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tutorToken');
    localStorage.removeItem('tutorName');
    navigate('/login');
  };

  const handleClaim = async (ticketId: string) => {
    const token = localStorage.getItem('tutorToken');
    if (!token) return;

    // We just send the request. We don't manually update the UI.
    // We wait for Pusher to tell us it changed.
    await fetch('/api/claim', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ ticketId }),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Complete': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}!</h1>
          <div className="flex gap-4 items-center">
             <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Connected
             </div>
             <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Log Out
             </button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                    </span>
                    <span className="font-semibold text-gray-700">{ticket.studentName}</span>
                    <span className="text-gray-400 text-sm">for {ticket.className}</span>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <div className="p-6">
                 <p className="text-gray-800 bg-gray-50 p-3 rounded mb-2">{ticket.problem}</p>
                 {ticket.status === 'New' ? (
                    <button onClick={() => handleClaim(ticket._id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Claim Ticket
                    </button>
                 ) : (
                    <span className="text-gray-500 italic">Claimed by {ticket.claimedBy}</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}