import React from 'react';
import { useSavedJobs } from '../context/SavedJobsContext';

const JobDetailsModal = ({ job, onClose }) => {
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();
  const isSaved = job ? savedJobs.some(j => j.job_id === job.job_id) : false;
  
  if (!job) return null;
  
  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveJob(job.job_id);
    } else {
      saveJob(job);
    }
  };
  
  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 max-w-4xl w-full rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left column with company info */}
          <div className="w-full md:w-1/3 bg-gray-800 p-6">
            <div className="flex flex-col items-center">
              {job.employer_logo ? (
                <img 
                  src={job.employer_logo} 
                  alt={`${job.employer_name} logo`} 
                  className="h-24 w-24 object-contain bg-gray-700 p-2 rounded-lg mb-4"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="h-24 w-24 flex items-center justify-center bg-gray-700 rounded-lg mb-4">
                  <span className="text-2xl font-bold text-gray-500">{job.employer_name?.charAt(0) || '?'}</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white text-center mb-2">{job.employer_name}</h3>
              
              {job.employer_website && (
                <a 
                  href={job.employer_website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 mb-4 inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Company Website
                </a>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Location</h4>
                <p className="text-gray-200">{job.job_city || 'Remote'}, {job.job_country}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Job Type</h4>
                <p className="text-gray-200">{job.job_employment_type || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Posted On</h4>
                <p className="text-gray-200">{formatDate(job.job_posted_at_datetime_utc)}</p>
              </div>
              
              {job.job_salary && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1">Salary</h4>
                  <p className="text-gray-200">{job.job_salary}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-3">
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
                Apply Now
              </a>
              
              <button 
                onClick={handleSaveToggle}
                className={`py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center ${
                  isSaved 
                    ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                    : 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-900 hover:bg-opacity-20'
                }`}
              >
                {isSaved ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    Save Job
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Right column with job details */}
          <div className="w-full md:w-2/3 p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2">{job.job_title}</h2>
            
            {job.job_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
                <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: job.job_description }}></div>
              </div>
            )}
            
            {job.job_highlights && job.job_highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Job Highlights</h3>
                <ul className="text-gray-300 list-disc pl-5 space-y-2">
                  {job.job_highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.job_required_skills && job.job_required_skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.job_required_skills.map((skill, index) => (
                    <span key={index} className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {job.job_benefits && (
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Benefits</h3>
                <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: job.job_benefits }}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;