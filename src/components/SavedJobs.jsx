import React, { useState } from 'react';
import { useSavedJobs } from '../context/SavedJobsContext';
import JobDetailsModal from './JobDetailsModal';

const SavedJobs = () => {
  const { savedJobs, unsaveJob } = useSavedJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'company', 'title'
  
  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };
  
  const closeModal = () => {
    setSelectedJob(null);
  };
  
  // Sort saved jobs based on selected criteria
  const sortedJobs = [...savedJobs].sort((a, b) => {
    switch (sortBy) {
      case 'company':
        return a.employer_name.localeCompare(b.employer_name);
      case 'title':
        return a.job_title.localeCompare(b.job_title);
      case 'date':
      default:
        // Assuming jobs have a timestamp, newer first
        return new Date(b.job_posted_at_datetime_utc || 0) - new Date(a.job_posted_at_datetime_utc || 0);
    }
  });

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Saved Jobs</h2>
          
          {savedJobs.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="date">Sort by Date</option>
                <option value="company">Sort by Company</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          )}
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No saved jobs yet</h3>
            <p className="text-gray-400 mb-6">When you find a job you like, click the "Save" button to add it to this list for easy access later.</p>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Browse Jobs
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedJobs.map((job) => (
              <div key={job.job_id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">{job.job_title}</h3>
                    {job.employer_logo && (
                      <img 
                        src={job.employer_logo} 
                        alt={`${job.employer_name} logo`} 
                        className="h-8 w-8 object-contain"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>
                  
                  <p className="text-blue-400 font-medium mb-2">{job.employer_name}</p>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {job.job_city || 'Remote'}, {job.job_country}
                    </span>
                    
                    {job.job_employment_type && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {job.job_employment_type}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 text-sm"
                    >
                      View Details
                    </button>
                    
                    <a
                      href={job.job_apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 text-center text-sm"
                    >
                      Apply Now
                    </a>
                    
                    <button
                      onClick={() => unsaveJob(job.job_id)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium p-2 rounded-lg transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedJobs.map((job) => (
              <div key={job.job_id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start md:items-center flex-1 gap-3 mb-3 md:mb-0">
                      {job.employer_logo ? (
                        <img 
                          src={job.employer_logo} 
                          alt={`${job.employer_name} logo`} 
                          className="h-10 w-10 object-contain bg-gray-700 p-1 rounded"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-700 rounded">
                          <span className="text-lg font-bold text-gray-500">{job.employer_name?.charAt(0) || '?'}</span>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white line-clamp-1">{job.job_title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <span className="text-blue-400">{job.employer_name}</span>
                          
                          <span className="text-gray-400 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {job.job_city || 'Remote'}, {job.job_country}
                          </span>
                          
                          {job.job_employment_type && (
                            <span className="text-gray-400">{job.job_employment_type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 text-sm"
                      >
                        View
                      </button>
                      
                      <a
                        href={job.job_apply_link}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 text-center text-sm"
                      >
                        Apply
                      </a>
                      
                      <button
                        onClick={() => unsaveJob(job.job_id)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium p-1.5 rounded-lg transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={closeModal} />
      )}
    </div>
  );
};

export default SavedJobs;