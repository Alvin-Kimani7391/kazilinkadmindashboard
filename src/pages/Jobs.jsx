import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Plus, Briefcase } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { jobs, users } from '../data/mockData';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(jobs.map(j => j.category))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAssign = (jobId) => {
    alert(`👷 Assigning worker to job ${jobId}`);
  };

  const handleComplete = (jobId) => {
    alert(`✅ Job ${jobId} completed!`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Jobs</h1>
          <p className="text-gray-500">Manage job postings, matching, and assignments</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-navy px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          Post Job
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-navy truncate">{job.title}</h3>
                <p className="text-xs text-gray-500">{job.id}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium truncate">{job.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Budget:</span>
                <span className="font-medium text-primary">{job.budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Employer:</span>
                <span className="truncate">{job.employer}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Worker:</span>
                <span className="truncate">{job.worker || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Posted:</span>
                <span>{job.posted}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Urgency:</span>
                <StatusBadge status={job.urgency} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                {job.offers} {job.offers === 1 ? 'offer' : 'offers'}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                  <Eye size={18} className="text-gray-400" />
                </button>
                {job.status === 'open' && (
                  <button
                    onClick={() => handleAssign(job.id)}
                    className="flex items-center gap-1 text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span className="text-xs font-medium">Assign</span>
                  </button>
                )}
                {job.status === 'in_progress' && (
                  <button
                    onClick={() => handleComplete(job.id)}
                    className="flex items-center gap-1 text-success hover:bg-success/10 px-3 py-1 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span className="text-xs font-medium">Complete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No jobs found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;