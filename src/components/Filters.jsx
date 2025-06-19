import React from 'react';

const Filters = ({ filters, onChange }) => {
  // Define common classes for all selects
  const selectClass = "bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300";

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-200 mb-3">Filter Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Job Type</label>
          <select 
            value={filters.jobType} 
            onChange={(e) => onChange('jobType', e.target.value)}
            className={selectClass}
          >
            <option value="">All Types</option>
            <option value="fulltime">Full-Time</option>
            <option value="parttime">Part-Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Date Posted */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date Posted</label>
          <select 
            value={filters.datePosted} 
            onChange={(e) => onChange('datePosted', e.target.value)}
            className={selectClass}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="3days">Last 3 Days</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Location Type</label>
          <select 
            value={filters.locationType} 
            onChange={(e) => onChange('locationType', e.target.value)}
            className={selectClass}
          >
            <option value="">All Locations</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Number of Pages */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Results Per Page</label>
          <select 
            value={filters.numPages} 
            onChange={(e) => onChange('numPages', e.target.value)}
            className={selectClass}
          >
            <option value="1">10 Results</option>
            <option value="2">20 Results</option>
            <option value="3">30 Results</option>
            <option value="4">40 Results</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;