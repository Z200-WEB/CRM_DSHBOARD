import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Users,
  TrendingUp,
  CheckSquare,
  DollarSign,
  Building2,
  Calendar,
  ChevronRight,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Settings,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';
import {
  customers,
  opportunities,
  tasks,
  formatCurrency,
  formatDate,
} from './data/dummyData';

// ============================================================
// CRM Dashboard - Portfolio Project
// ============================================================
// This application demonstrates a Salesforce-inspired CRM system
// designed to showcase understanding of B2B sales processes and
// enterprise software design patterns.
//
// Key Business Concepts Implemented:
// 1. Account/Lead Management - Tracking customer relationships
// 2. Opportunity Pipeline - Managing sales deals through stages
// 3. Task Management - Ensuring timely follow-ups
// 4. Dashboard Analytics - Data-driven decision making
// ============================================================

// Color constants matching Salesforce Lightning Design System
const COLORS = {
  blue: '#0176d3',
  green: '#2e844a',
  yellow: '#fe9339',
  red: '#ea001e',
  purple: '#9050e9',
  teal: '#0b827c',
};

const STAGE_COLORS = {
  'Discovery': COLORS.purple,
  'Qualification': COLORS.teal,
  'Proposal': COLORS.blue,
  'Negotiation': COLORS.yellow,
  'Closed Won': COLORS.green,
  'Closed Lost': COLORS.red,
};

const STATUS_COLORS = {
  'Active': 'bg-green-100 text-green-800',
  'Prospect': 'bg-blue-100 text-blue-800',
  'Inactive': 'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-gray-100 text-gray-600',
};

const TASK_STATUS_COLORS = {
  'Completed': 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Not Started': 'bg-gray-100 text-gray-600',
};

// ============================================================
// Reusable UI Components
// ============================================================

// Status Badge Component
const StatusBadge = ({ status, colorMap }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-600'}`}>
    {status}
  </span>
);

// Stat Card Component for Dashboard Overview
const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ============================================================
// Navigation Component
// ============================================================
const Navigation = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-salesforce-navy min-h-screen fixed left-0 top-0">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-salesforce-navy" />
            </div>
            CRM Dashboard
          </h1>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-salesforce-blue text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-salesforce-navy z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-salesforce-navy" />
          </div>
          <h1 className="text-white text-lg font-bold">CRM Dashboard</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="absolute top-14 left-0 right-0 bg-salesforce-navy p-4" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activeTab === item.id
                    ? 'bg-salesforce-blue text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

// ============================================================
// Top Bar Component
// ============================================================
const TopBar = ({ searchQuery, setSearchQuery }) => (
  <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4 flex-1">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search accounts, opportunities, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
        />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
        <div className="w-8 h-8 bg-salesforce-blue rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">Sales Rep</span>
      </div>
    </div>
  </div>
);

// ============================================================
// Dashboard Overview Component
// ============================================================
const DashboardOverview = () => {
  // Calculate metrics from data
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter(
    (o) => !['Closed Won', 'Closed Lost'].includes(o.stage)
  ).length;
  const totalPipeline = opportunities
    .filter((o) => !['Closed Won', 'Closed Lost'].includes(o.stage))
    .reduce((sum, o) => sum + o.amount, 0);
  const wonDeals = opportunities.filter((o) => o.stage === 'Closed Won');
  const wonRevenue = wonDeals.reduce((sum, o) => sum + o.amount, 0);
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  // Prepare chart data
  const stageData = useMemo(() => {
    const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    return stages.map((stage) => ({
      name: stage,
      count: opportunities.filter((o) => o.stage === stage).length,
      amount: opportunities.filter((o) => o.stage === stage).reduce((sum, o) => sum + o.amount, 0),
    }));
  }, []);

  const customerStatusData = useMemo(() => {
    const statuses = ['Active', 'Prospect', 'Inactive'];
    return statuses.map((status) => ({
      name: status,
      value: customers.filter((c) => c.status === status).length,
    }));
  }, []);

  const PIE_COLORS = [COLORS.green, COLORS.blue, COLORS.red];

  return (
    <div className="space-y-6">
      {/* Project Description */}
      <div className="bg-gradient-to-r from-salesforce-blue to-salesforce-darkBlue rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">CRM Dashboard Overview</h2>
        <p className="text-blue-100 text-sm leading-relaxed">
          This dashboard provides a centralized view of customer relationships, sales opportunities,
          and task management. Designed to support data-driven decision making, it helps sales teams
          prioritize high-value activities and maintain strong customer relationships throughout the
          sales cycle.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Accounts"
          value={totalCustomers}
          icon={Building2}
          change={12}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Opportunities"
          value={activeOpportunities}
          icon={Briefcase}
          change={8}
          color="bg-purple-500"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(totalPipeline)}
          icon={DollarSign}
          change={15}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={CheckSquare}
          change={-5}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunity Pipeline Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <SectionHeader
            title="Opportunity Pipeline"
            subtitle="Revenue by sales stage"
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `¥${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <SectionHeader
            title="Account Status Distribution"
            subtitle="Breakdown by relationship status"
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {customerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, 'Accounts']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <SectionHeader
            title="Top Opportunities"
            subtitle="Highest value deals in progress"
            action={
              <button className="text-sm text-salesforce-blue hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            }
          />
          <div className="space-y-3">
            {opportunities
              .filter((o) => !['Closed Won', 'Closed Lost'].includes(o.stage))
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
              .map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{opp.name}</p>
                    <p className="text-sm text-gray-500">{opp.accountName}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900">{formatCurrency(opp.amount)}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${STAGE_COLORS[opp.stage]}20`,
                        color: STAGE_COLORS[opp.stage],
                      }}
                    >
                      {opp.stage}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <SectionHeader
            title="Upcoming Tasks"
            subtitle="Tasks due soon"
            action={
              <button className="text-sm text-salesforce-blue hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            }
          />
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status !== 'Completed')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 4)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {task.status === 'In Progress' ? (
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{task.subject}</p>
                      <p className="text-sm text-gray-500 truncate">{task.relatedTo}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-600">{formatDate(task.dueDate)}</p>
                    <StatusBadge status={task.priority} colorMap={PRIORITY_COLORS} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Accounts Component
// ============================================================
const AccountsView = ({ searchQuery }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        searchQuery === '' ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
      const matchesType = typeFilter === 'All' || customer.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Section Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Management</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Accounts represent companies and organizations that have business relationships with your company.
          This view allows sales representatives to track customer information, monitor engagement levels,
          and identify accounts that may need attention. Effective account management is essential for
          maintaining strong customer relationships and identifying upsell opportunities.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Prospect">Prospect</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
          >
            <option value="All">All Types</option>
            <option value="Customer">Customer</option>
            <option value="Lead">Lead</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredCustomers.length} of {customers.length} accounts
          </span>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Annual Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-salesforce-blue hover:underline cursor-pointer">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.industry}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={customer.status} colorMap={STATUS_COLORS} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.owner}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(customer.annualRevenue)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(customer.lastActivity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No accounts found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Opportunities Component
// ============================================================
const OpportunitiesView = ({ searchQuery }) => {
  const [stageFilter, setStageFilter] = useState('All');

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        searchQuery === '' ||
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === 'All' || opp.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [searchQuery, stageFilter]);

  const pipelineTotal = filteredOpportunities
    .filter((o) => !['Closed Won', 'Closed Lost'].includes(o.stage))
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      {/* Section Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Opportunity Management</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Opportunities represent potential sales deals at various stages in the pipeline.
          Tracking opportunities helps forecast revenue, prioritize sales activities, and
          identify deals that need attention. Each opportunity moves through stages from
          initial discovery to close, with probability percentages indicating likelihood of success.
        </p>
      </div>

      {/* Pipeline Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-purple-100 text-sm">Active Pipeline Value</p>
            <p className="text-3xl font-bold">{formatCurrency(pipelineTotal)}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-purple-100 text-sm">Open Deals</p>
              <p className="text-xl font-semibold">
                {filteredOpportunities.filter((o) => !['Closed Won', 'Closed Lost'].includes(o.stage)).length}
              </p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Won This Period</p>
              <p className="text-xl font-semibold">
                {filteredOpportunities.filter((o) => o.stage === 'Closed Won').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Stage:</span>
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
          >
            <option value="All">All Stages</option>
            <option value="Discovery">Discovery</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredOpportunities.length} opportunities
          </span>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Opportunity Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Close Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-salesforce-blue hover:underline cursor-pointer">
                      {opp.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{opp.description}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{opp.accountName}</td>
                  <td className="px-4 py-4">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${STAGE_COLORS[opp.stage]}20`,
                        color: STAGE_COLORS[opp.stage],
                      }}
                    >
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(opp.amount)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${opp.probability}%`,
                            backgroundColor: opp.probability >= 75 ? COLORS.green : opp.probability >= 50 ? COLORS.yellow : COLORS.red,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{opp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{formatDate(opp.closeDate)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{opp.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No opportunities found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Tasks Component
// ============================================================
const TasksView = ({ searchQuery }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === '' ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.relatedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    notStarted: tasks.filter((t) => t.status === 'Not Started').length,
    highPriority: tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Section Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Task Management</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Tasks help sales representatives stay organized and ensure timely follow-ups with customers
          and prospects. Each task is linked to an account or opportunity, enabling teams to track
          all activities related to a deal. Prioritizing tasks by urgency and due date helps maintain
          momentum in the sales process and prevents opportunities from going cold.
        </p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{taskStats.highPriority}</p>
          <p className="text-sm text-gray-500">High Priority</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
          >
            <option value="All">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-salesforce-blue focus:border-salesforce-blue outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredTasks.length} tasks
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">
                  <span className="sr-only">Status Icon</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Related To
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    {task.status === 'Completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : task.status === 'In Progress' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{task.subject}</p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-salesforce-blue hover:underline cursor-pointer">
                      {task.relatedTo}
                    </p>
                    <p className="text-xs text-gray-500">{task.relatedType}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={task.status} colorMap={TASK_STATUS_COLORS} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={task.priority} colorMap={PRIORITY_COLORS} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <span
                      className={
                        new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                          ? 'text-red-600 font-medium'
                          : ''
                      }
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{task.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Main App Component
// ============================================================
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'accounts':
        return <AccountsView searchQuery={searchQuery} />;
      case 'opportunities':
        return <OpportunitiesView searchQuery={searchQuery} />;
      case 'tasks':
        return <TasksView searchQuery={searchQuery} />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-56 min-h-screen">
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Page Content */}
        <main className="p-4 sm:p-6 mt-14 lg:mt-0">
          {renderContent()}

          {/* Portfolio Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Project</h3>
              <div className="prose prose-sm text-gray-600 max-w-none">
                <p className="mb-3">
                  This CRM Dashboard was built as a portfolio project to demonstrate understanding of
                  enterprise business applications and modern frontend development practices. The design
                  is inspired by Salesforce Lightning, focusing on usability and practical business workflows.
                </p>
                <p className="mb-3">
                  <strong>Key focus areas during development:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>Understanding B2B sales processes (lead qualification, opportunity management, task tracking)</li>
                  <li>Creating intuitive data visualization for business metrics</li>
                  <li>Implementing responsive design for cross-device accessibility</li>
                  <li>Writing clean, maintainable React code with proper component architecture</li>
                  <li>Using Tailwind CSS for consistent, professional styling</li>
                </ul>
                <p className="text-gray-500 text-xs">
                  Built with React, Tailwind CSS, and Recharts. No backend required - uses realistic dummy data.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
