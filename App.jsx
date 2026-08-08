import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [timestamp, setTimestamp] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    panStatus: 'Pending',
    panDesc: 'Formal correspondence sent to Protean. Awaiting correction.',
    hdrcStatus: 'Scheduled',
    hdrcDesc: 'Account opening appointment postponed. PAN resolution is blocker.',
    gstStatus: 'Active',
    gstDesc: 'Coordinating with Vinit. MSME deferred until GST issued.',
    monthlyBurn: '₹5-6L',
    monthsLeft: '14-16',
    surveyResponses: 26,
  });

  useEffect(() => {
    setTimestamp(new Date().toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }));

    // Listen to Firestore for real-time updates
    const unsubscribe = onSnapshot(doc(db, 'dashboard', 'main'), (doc) => {
      if (doc.exists()) {
        setDashboardData(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async (field, value) => {
    const updatedData = { ...dashboardData, [field]: value };
    setDashboardData(updatedData);

    try {
      await setDoc(doc(db, 'dashboard', 'main'), updatedData, { merge: true });
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  };

  const runwayChartData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Runway (₹L)',
        data: [80, 74.5, 68.7, 62.7, 56.5, 50.1, 43.6, 37.1, 30.5, 23.9, 17.2, 10.5, 3.8],
        borderColor: '#663399',
        backgroundColor: 'rgba(102, 51, 153, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      }
    ]
  };

  const runwayChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Runway (₹ Lakhs)' }
      }
    }
  };

  const StatusCard = ({ label, title, value, description, status, meta }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
      status === 'green' ? 'border-green-500' :
      status === 'yellow' ? 'border-yellow-500' :
      'border-red-500'
    } hover:shadow-md transition-all`}>
      <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">{label}</div>
      <div className="text-lg font-bold text-blue-900 mb-2">{title}</div>
      
      {editMode ? (
        <div className="mb-2 space-y-2">
          <select 
            value={value}
            onChange={(e) => handleUpdate(label.split(' ')[0].toLowerCase() + 'Status', e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option>Pending</option>
            <option>Active</option>
            <option>Scheduled</option>
            <option>Resolved</option>
            <option>Blocked</option>
          </select>
          <textarea 
            value={description}
            onChange={(e) => handleUpdate(label.split(' ')[0].toLowerCase() + 'Desc', e.target.value)}
            className="w-full p-2 border rounded text-xs"
            rows="3"
          />
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold text-yellow-500 mb-2">{value}</div>
          <div className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</div>
        </>
      )}
      
      <div className="text-xs text-gray-500 border-t pt-3">{meta}</div>
    </div>
  );

  const Milestone = ({ date, title, description, status }) => {
    const statusColor = status === 'completed' ? 'bg-green-500' :
                       status === 'in-progress' ? 'bg-yellow-500' :
                       'bg-gray-300';
    
    return (
      <div className="flex gap-4 pb-6 relative">
        <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${statusColor}`}></div>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{date}</div>
          <div className="font-bold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    );
  };

  const TeamMember = ({ initials, name, role, badge }) => (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div>
          <div className="font-bold text-sm text-blue-900">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
      <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">{badge}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 shadow-lg border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">🎯 Samantra Command Center</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm opacity-80">Last updated: {timestamp}</div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                editMode 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-yellow-400 hover:bg-yellow-500 text-blue-900'
              }`}
            >
              {editMode ? '✓ Done Editing' : '✏️ Edit Dashboard'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Critical Status Section */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">🚨 Critical Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatusCard 
            label="panStatus"
            title="Citizenship Field Issue"
            value={dashboardData.panStatus}
            description={dashboardData.panDesc}
            status="yellow"
            meta="Ack: 882133280173725 | Owner: Aadhithya"
          />
          <StatusCard 
            label="hdrcStatus"
            title="Blocked by PAN"
            value={dashboardData.hdrcStatus}
            description={dashboardData.hdrcDesc}
            status="yellow"
            meta="Depends on PAN fix | Owner: Aadhithya"
          />
          <StatusCard 
            label="gstStatus"
            title="In Progress"
            value={dashboardData.gstStatus}
            description={dashboardData.gstDesc}
            status="yellow"
            meta="Owner: Aadhithya & Vinit"
          />
          <StatusCard 
            label="fundingStatus"
            title="₹80L Pre-Seed"
            value="12-15 Mo"
            description="18-month allocation. Team of 5. Burn rate monitoring active."
            status="green"
            meta="Allocation: ₹80 Lakhs | Owner: Aadhithya"
          />
        </div>

        {/* Key Metrics */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">📈 Key Metrics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">Monthly Burn & Runway</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Monthly Burn</div>
                {editMode ? (
                  <input
                    type="text"
                    value={dashboardData.monthlyBurn}
                    onChange={(e) => handleUpdate('monthlyBurn', e.target.value)}
                    className="w-full p-2 border rounded text-lg font-bold text-center"
                  />
                ) : (
                  <div className="text-2xl font-bold text-blue-900">{dashboardData.monthlyBurn}</div>
                )}
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Months Left</div>
                {editMode ? (
                  <input
                    type="text"
                    value={dashboardData.monthsLeft}
                    onChange={(e) => handleUpdate('monthsLeft', e.target.value)}
                    className="w-full p-2 border rounded text-lg font-bold text-center"
                  />
                ) : (
                  <div className="text-2xl font-bold text-blue-900">{dashboardData.monthsLeft}</div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600">Salaries ₹2.8L + Infrastructure ₹1.2L + Marketing ₹1.5L + Misc ₹0.5L</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">PrimeState User Research</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900">Survey Responses</span>
                {editMode ? (
                  <input
                    type="number"
                    value={dashboardData.surveyResponses}
                    onChange={(e) => handleUpdate('surveyResponses', parseInt(e.target.value))}
                    className="w-20 p-1 border rounded text-sm font-bold text-yellow-500"
                  />
                ) : (
                  <span className="text-sm font-bold text-yellow-500">{dashboardData.surveyResponses}/100</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${dashboardData.surveyResponses}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Form specification ready. Increase outreach via Lakshmi's college network and social channels.</p>
          </div>
        </div>

        {/* Operations & Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">Product Milestones (18-Month)</h3>
            <div className="space-y-2">
              <Milestone date="May 2026 ✓" title="Company Incorporation" description="CIN: U62010TS2026PTC215636 | Team formation" status="completed" />
              <Milestone date="Aug - Sep 2026" title="PrimeState MVP & Beta" description="Core reframing modules, user onboarding, analytics" status="in-progress" />
              <Milestone date="Oct - Nov 2026" title="First Institutional Pilot" description="1-2 college partners, 500+ students" status="in-progress" />
              <Milestone date="Nov 2, 2026" title="INC-20A Filing" description="Commencement of Business declaration" status="pending" />
              <Milestone date="Dec 2026 - Q1 2027" title="Market Expansion" description="Scale to 5+ institutions, 5K students" status="pending" />
              <Milestone date="Nov 2027" title="Series A Target" description="₹1.5 Cr ARR, 50K+ students" status="pending" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">Core Team (5 Members)</h3>
            <TeamMember initials="AA" name="Aadhithya Narayanan" role="Co-Founder & CEO" badge="Strategy, Ops" />
            <TeamMember initials="SG" name="Shikha Gundapaneni" role="Founder & CTO" badge="Product, Tech" />
            <TeamMember initials="LC" name="Lakshmi Chandana Reddy" role="CMO" badge="Go-to-Market" />
            <TeamMember initials="GS" name="Gaayathri Sriram" role="Director" badge="Strategy" />
            <TeamMember initials="NH" name="Nadimpally Himasri" role="Director" badge="Operations" />
          </div>
        </div>

        {/* Financial Dashboard */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">💰 Financial Runway Projection</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <div style={{ height: '350px' }}>
            <Line data={runwayChartData} options={runwayChartOptions} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6 border-t-2 border-yellow-400 mt-12">
        <p className="text-xs opacity-80">&copy; 2026 Samantra Cognitive Tech Private Limited | Leadership Dashboard | For internal use only</p>
        {editMode && <p className="text-xs mt-2 text-yellow-300">💡 Edit mode active — Changes save to cloud automatically</p>}
      </footer>
    </div>
  );
}

