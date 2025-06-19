import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Filter from '../components/Filters';
import SavedJobs from '../components/SavedJobs';
import { useSavedJobs } from '../context/SavedJobsContext';
import JobDetailsModal from '../components/JobDetailsModal';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { savedJobs, saveJob, unsaveJob } = useSavedJobs();

  const [filters, setFilters] = useState({
    jobType: '',
    datePosted: 'all',
    locationType: '',
    numPages: 1,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
        },
        params: {
          query: `${query || 'internship'} ${location}`,
          page: '1',
          num_pages: filters.numPages.toString(),
          country: 'us',
          date_posted: filters.datePosted,
          job_type: filters.jobType,
          location_type: filters.locationType,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        setJobs(response.data.data);
        setSelectedJob(null);
      } else {
        setJobs([]);
        setError('No jobs found matching your criteria. Try adjusting your search or filters.');
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to fetch jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const res = await axios.get('https://jsearch.p.rapidapi.com/job-details', {
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
        },
        params: {
          job_id: jobId,
          country: 'us',
        },
      });

      if (res.data.data && res.data.data.length > 0) {
        setSelectedJob(res.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="mx-auto">
        <header className="bg-gray-950 py-8 px-4 md:px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Internship & Job Finder</h1>
            <p className="text-gray-400">Find your next career opportunity from thousands of listings</p>
          </div>
        </header>

        {/* Search Section */}
        <section className="px-4 md:px-8 py-8">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 shadow-xl border border-blue-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-4">Find Your Perfect Job</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-1">Job Title or Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g., Frontend Developer, Data Analyst"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., New York, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="bg-gray-900 bg-opacity-30 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-200 mb-3">Filter Jobs</h3>
                <Filter filters={filters} onChange={handleFilterChange} />
              </div>
              
              <button 
                onClick={fetchJobs} 
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search Jobs
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Job Listings */}
              <div className="lg:col-span-2">
                <section className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
                  <div className="border-b border-gray-700 px-6 py-4 bg-gray-800 bg-opacity-70">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h2 className="text-xl font-bold text-white mb-2 md:mb-0">Job Listings</h2>
                      {jobs.length > 0 && (
                        <span className="text-sm bg-blue-900 text-blue-200 px-3 py-1 rounded-full">
                          {jobs.length} results found
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {loading && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative w-16 h-16 mb-4">
                          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-opacity-20 rounded-full animate-pulse"></div>
                          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-300 text-lg font-medium">Searching for jobs...</p>
                        <p className="text-gray-500 mt-2">Please wait while we find the best opportunities for you</p>
                      </div>
                    )}
                    
                    {error && !loading && (
                      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
                        <div className="flex">
                          <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p>{error}</p>
                        </div>
                      </div>
                    )}
                    
                    {!loading && !error && jobs.length === 0 && (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                        <button 
                          onClick={() => {
                            setQuery('');
                            setLocation('');
                            setFilters({
                              jobType: '',
                              datePosted: 'all',
                              locationType: '',
                              numPages: 1,
                            });
                            fetchJobs();
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          Reset Search
                        </button>
                      </div>
                    )}
                    
                    {!loading && jobs.length > 0 && (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <div 
                            key={job.job_id} 
                            className="bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-300 p-4"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <div className="mb-4 md:mb-0">
                                <h3 className="text-lg font-semibold text-white">{job.job_title}</h3>
                                <p className="text-blue-400">{job.employer_name}</p>
                                <div className="flex flex-wrap items-center text-sm text-gray-400 mt-1 gap-x-3">
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
                                      {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {job.employer_logo && (
                                <img 
                                  src={job.employer_logo} 
                                  alt={`${job.employer_name} logo`} 
                                  className="h-12 w-12 object-contain bg-gray-800 p-1 rounded-lg"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                />
                              )}
                            </div>
                            
                            {job.job_description && (
                              <p className="text-gray-400 mb-4 line-clamp-2">
                                {job.job_description.slice(0, 150)}...
                              </p>
                            )}
                            
                            <div className="flex gap-3">
                              <button 
                                onClick={() => fetchJobDetails(job.job_id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                View Details
                              </button>
                              
                              {savedJobs.some(j => j.job_id === job.job_id) ? (
                                <button 
                                  onClick={() => unsaveJob(job.job_id)}
                                  className="bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                                  </svg>
                                  Saved
                                </button>
                              ) : (
                                <button 
                                  onClick={() => saveJob(job)}
                                  className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-900 hover:bg-opacity-20 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                  </svg>
                                  Save Job
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
              
              {/* Saved Jobs */}
              <div>
                <section className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden sticky top-8">
                  <div className="border-b border-gray-700 px-6 py-4 bg-gray-800 bg-opacity-70">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                      </svg>
                      Saved Jobs
                    </h2>
                  </div>
                  
                  <div className="p-4">
                    {savedJobs.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <h3 className="text-gray-300 text-lg font-medium mb-2">No saved jobs</h3>
                        <p className="text-gray-500 text-sm">Jobs you save will appear here for easy access</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedJobs.slice(0, 5).map((job) => (
                          <div key={job.job_id} className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200">
                            <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">{job.job_title}</h3>
                            <p className="text-blue-400 text-xs mb-2">{job.employer_name}</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setSelectedJob(job)}
                                className="text-xs bg-blue-900 hover:bg-blue-800 text-blue-300 px-2 py-1 rounded transition-colors duration-200"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => unsaveJob(job.job_id)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors duration-200"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {savedJobs.length > 5 && (
                          <div className="text-center pt-2 border-t border-gray-700">
                            <a href="/saved-jobs" className="text-blue-400 hover:text-blue-300 text-sm">
                              View all {savedJobs.length} saved jobs
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-400 py-6 mt-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-lg font-semibold text-white mr-2">InternFinder</span>
                <span className="text-sm">© {new Date().getFullYear()} All rights reserved.</span>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;