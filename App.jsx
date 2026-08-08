import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }));
  }, []);

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
      <div className="text-3xl font-bold text-yellow-500 mb-2">{value}</div>
      <div className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</div>
      <div className="text-xs text-gray-500 border-t pt-3">{meta}</div>
    </div>
  );

  const RiskItem = ({ severity, title, description, owner }) => {
    const severityColor = severity === 'high' ? 'bg-red-100 border-red-500' :
                         severity === 'medium' ? 'bg-yellow-100 border-yellow-500' :
                         'bg-green-100 border-green-500';
    const badgeColor = severity === 'high' ? 'bg-red-600' :
                      severity === 'medium' ? 'bg-yellow-600' :
                      'bg-green-600';
    
    return (
      <div className={`p-4 mb-3 border-l-4 rounded ${severityColor}`}>
        <span className={`inline-block text-xs font-bold text-white px-2 py-1 rounded mb-2 ${badgeColor}`}>
          {severity.toUpperCase()}
        </span>
        <div className="font-bold text-gray-900 mb-1">{title}</div>
        <p className="text-sm text-gray-700 mb-2">{description}</p>
        <div className="text-xs text-gray-600">{owner}</div>
      </div>
    );
  };

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
          <div className="text-sm opacity-80">Last updated: {timestamp}</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Critical Status Section */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">🚨 Critical Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatusCard 
            label="🔒 PAN Registration"
            title="Citizenship Field Issue"
            value="Pending"
            description="Formal correspondence sent to Protean. Awaiting correction."
            status="yellow"
            meta="Ack: 882133280173725 | Owner: Aadhithya"
          />
          <StatusCard 
            label="💳 HDFC Current Account"
            title="Blocked by PAN"
            value="Scheduled"
            description="Account opening appointment postponed. PAN resolution is blocker."
            status="yellow"
            meta="Depends on PAN fix | Owner: Aadhithya"
          />
          <StatusCard 
            label="📊 GST Registration"
            title="In Progress"
            value="Active"
            description="Coordinating with Vinit. MSME deferred until GST issued."
            status="yellow"
            meta="Owner: Aadhithya & Vinit"
          />
          <StatusCard 
            label="💰 Funding Runway"
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
                <div className="text-2xl font-bold text-blue-900">₹5-6L</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Months Left</div>
                <div className="text-2xl font-bold text-blue-900">14-16</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Salaries ₹2.8L + Infrastructure ₹1.2L + Marketing ₹1.5L + Misc ₹0.5L</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">PrimeState User Research</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900">Survey Responses</span>
                <span className="text-sm font-bold text-yellow-500">26/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '26%' }}></div>
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

        {/* Risk Register */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">⚠️ Risk Register & Blockers</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">Active Blockers</h3>
            <RiskItem 
              severity="high"
              title="PAN Citizenship Field Mismatch"
              description="Protean portal error. Formal correction sent. Blocks HDFC account and compliance."
              owner="Owner: Aadhithya | ETA: Aug 15, 2026"
            />
            <RiskItem 
              severity="high"
              title="HDFC Account Activation"
              description="Cannot open account without valid PAN. Board resolution drafted."
              owner="Owner: Aadhithya | Depends on: PAN resolution"
            />
            <RiskItem 
              severity="medium"
              title="GST Processing Delay"
              description="GST approval timeline uncertain. MSME deferred until GST issued."
              owner="Owner: Vinit (Startup Movers) | ETA: Sep 2026"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4">Strategic Risks</h3>
            <RiskItem 
              severity="medium"
              title="User Research Velocity"
              description="26/100 responses (26%). Need 30-40 for persona clarity. Institutional outreach critical."
              owner="Owner: Lakshmi | Target: 50+ responses by Sep"
            />
            <RiskItem 
              severity="medium"
              title="Product-Market Fit Timeline"
              description="MVP + pilot compressed into 3-4 months. Requires tight execution."
              owner="Owner: Shikha & Lakshmi | Critical path: Aug-Nov 2026"
            />
            <RiskItem 
              severity="low"
              title="Competitive Market Entry"
              description="Student mental health space growing. Differentiation through institutional model."
              owner="Owner: Aadhithya | Strategy: Execution speed"
            />
          </div>
        </div>

        {/* Key Dates */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-gray-200">📅 Key Dates & Deadlines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">URGENT</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Aug 6, 2026</div>
            <div className="text-xs text-gray-600">PAN courier deadline to Protean</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">SOON</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Aug 15, 2026</div>
            <div className="text-xs text-gray-600">PAN correction expected resolution</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">TARGET</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Aug 31, 2026</div>
            <div className="text-xs text-gray-600">HDFC account opening (post-PAN fix)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">CRITICAL</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Nov 2, 2026</div>
            <div className="text-xs text-gray-600">INC-20A filing deadline</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">MILESTONE</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Sep 2026</div>
            <div className="text-xs text-gray-600">GST approval (target)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">LAUNCH</div>
            <div className="text-sm font-bold text-blue-900 mb-1">Oct - Nov 2026</div>
            <div className="text-xs text-gray-600">PrimeState MVP + first pilot</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6 border-t-2 border-yellow-400 mt-12">
        <p className="text-xs opacity-80">&copy; 2026 Samantra Cognitive Tech Private Limited | Leadership Dashboard | For internal use only</p>
      </footer>
    </div>
  );
}
