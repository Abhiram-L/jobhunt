import React, { useState, useEffect, useCallback } from 'react';
import { fetchJobs } from '../utils/api';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';

const InternshipList = ({ searchQuery, filters }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Memoize the fetch function to prevent recreation on every render
  const fetchJobsData = useCallback(async (resetJobs = true) => {
    if (resetJobs) {
      setIsLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }
    
    setError(null);
    
    try {
      // Use the query string from props or a default value
      const query = searchQuery || 'internship';
      
      // Convert filter values to API parameters
      const pageToFetch = resetJobs ? 1 : page + 1;
      const country = filters?.country || 'in';
      const datePosted = filters?.datePosted || 'all';
      const jobType = filters?.jobType || '';
      const locationType = filters?.locationType || '';
      
      const jobsData = await fetchJobs(query, pageToFetch, country, datePosted, jobType, locationType);
      
      if (resetJobs) {
        setJobs(jobsData);
      } else {
        // Append new jobs and avoid duplicates
        const existingIds = new Set(jobs.map(job => job.job_id));
        const newJobs = jobsData.filter(job => !existingIds.has(job.job_id));
        
        if (newJobs.length === 0) {
          setHasMore(false);
        } else {
          setJobs(prevJobs => [...prevJobs, ...newJobs]);
          setPage(pageToFetch);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load internships. Please try again later.');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, filters, page, jobs]); // Dependencies include jobs for deduplication
  
  // Fetch jobs when searchQuery or filters change
  useEffect(() => {
    fetchJobsData(true);
  }, [searchQuery, filters]);
  
  // Handle job selection
  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job);
  }, []);
  
  // Handle loading more jobs
  const loadMoreJobs = useCallback(() => {
    if (!isLoading && !loadingMore && hasMore) {
      fetchJobsData(false);
    }
  }, [isLoading, loadingMore, hasMore, fetchJobsData]);
  
  // Handle close modal
  const handleCloseModal = useCallback(() => {
    setSelectedJob(null);
  }, []);
  
  // Loading state
  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-300 text-lg font-medium">Loading internships...</p>
        <p className="text-gray-500 mt-2">Please wait while we fetch the latest opportunities</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl border border-red-800 p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <p className="text-red-300 text-xl font-semibold mb-4">{error}</p>
        <p className="text-gray-400 mb-6">There was a problem loading the internships. Please try again later.</p>
        <button 
          onClick={() => fetchJobsData(true)} 
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state
  if (jobs.length === 0 && !isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">No internships found</h3>
        <p className="text-gray-400 mb-6">We couldn't find any internships matching your search criteria. Try adjusting your filters or search term.</p>
        <button 
          onClick={() => fetchJobsData(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset Search
        </button>
      </div>
    );
  }
  
  // Main content
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Available Internships</h2>
          <p className="text-gray-400">
            {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'} found 
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <span className="text-gray-400 mr-2">Last updated:</span>
          <span className="bg-gray-800 text-blue-300 px-3 py-1 rounded-lg text-sm">
            {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map(job => (
          <JobCard 
            key={job.job_id} 
            job={job} 
            onSelect={() => handleSelectJob(job)}
          />
        ))}
      </div>
      
      {jobs.length > 0 && (
        <div className="mt-8 flex justify-center">
          {loadingMore ? (
            <div className="flex items-center py-4 px-6 bg-gray-800 rounded-lg">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-300">Loading more opportunities...</span>
            </div>
          ) : hasMore ? (
            <button 
              onClick={loadMoreJobs}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              Load More Internships
            </button>
          ) : (
            <div className="bg-gray-800 py-3 px-6 rounded-lg text-gray-400">
              You've reached the end of the list
            </div>
          )}
        </div>
      )}
      
      {/* Job details modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default InternshipList;