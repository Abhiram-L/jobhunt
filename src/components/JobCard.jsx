import React, { memo } from 'react';
import { useSavedJobs } from '../context/SavedJobsContext';

const JobCard = memo(({ job, onSelect }) => {
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const isSaved = savedJobs.some(j => j.job_id === job.job_id);
  
  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (isSaved) {
      unsaveJob(job.job_id);
    } else {
      saveJob(job);
    }
  };

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">{job.job_title}</h3>
            <p className="text-blue-400 font-medium mb-1">{job.employer_name}</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-2">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {job.job_city || 'Remote'}, {job.job_country}
              </span>
              
              {job.job_employment_type && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {job.job_employment_type}
                </span>
              )}
              
              {job.job_posted_at_datetime_utc && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Posted {formatDate(job.job_posted_at_datetime_utc)}
                </span>
              )}
            </div>
          </div>
          
          {job.employer_logo && (
            <div className="ml-4 bg-gray-700 p-2 rounded-lg">
              <img 
                src={job.employer_logo} 
                alt={`${job.employer_name} logo`} 
                className="h-12 w-12 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}
        </div>
        
        {job.job_description && (
          <p className="text-gray-300 mb-4 line-clamp-2">
            {job.job_description.slice(0, 150)}...
          </p>
        )}
        
        {job.job_highlights && job.job_highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-1">Highlights:</h4>
            <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
              {job.job_highlights.slice(0, 2).map((highlight, index) => (
                <li key={index} className="line-clamp-1">{highlight}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex gap-3 mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(job.job_id);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            View Details
          </button>
          
          <button 
            onClick={handleSaveToggle}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center ${
              isSaved 
                ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                : 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-900 hover:bg-opacity-20'
            }`}
          >
            {isSaved ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default JobCard;