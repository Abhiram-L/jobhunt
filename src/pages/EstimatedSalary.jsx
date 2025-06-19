import React, { useState } from 'react';
import axios from 'axios';

const EstimatedSalary = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format salary numbers with commas
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const fetchSalary = async () => {
    if (!jobTitle || !location) {
      setError('Please enter both job title and location');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('https://jsearch.p.rapidapi.com/estimated-salary', {
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': '707109a025mshda42c3503426be0p1b711cjsn58cd04b675ea',
        },
        params: {
          job_title: jobTitle,
          location,
          location_type: 'ANY',
          years_of_experience: 'ALL',
        },
      });

      if (res.data.data && res.data.data.length > 0) {
        setResult(res.data.data[0]); // Show the first entry
      } else {
        setError('No salary data found for this combination');
      }
    } catch (err) {
      console.error('Failed to fetch salary', err);
      setError('Failed to fetch salary data. Please try again later.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gray-800 bg-opacity-50 px-6 py-5 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Estimated Salary Lookup
            </h1>
            <p className="text-gray-400 mt-1">Discover the typical salary range for your desired role and location</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Frontend Developer, Data Scientist"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g., New York, San Francisco, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            
            <button 
              onClick={fetchSalary} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating Salary...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Calculate Estimated Salary
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-6 bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-green-900 px-6 py-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">{result.job_title}</h2>
                  <p className="text-blue-200">{result.location}</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-1">Median Salary</p>
                    <p className="text-4xl font-bold text-green-400">${formatSalary(result.estimated_salary)}</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Salary Range</p>
                    
                    {/* Salary Range Visualization */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">${formatSalary(result.min_salary)}</span>
                        <span className="text-sm text-gray-400">${formatSalary(result.max_salary)}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 relative"
                          style={{ 
                            width: `${((result.estimated_salary - result.min_salary) / (result.max_salary - result.min_salary)) * 100}%` 
                          }}
                        >
                          <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">Minimum</p>
                        <p className="text-xl font-medium text-gray-200">${formatSalary(result.min_salary)}</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">Maximum</p>
                        <p className="text-xl font-medium text-gray-200">${formatSalary(result.max_salary)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4 text-blue-200">
                    <div className="flex">
                      <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium mb-1">Salary insights</p>
                        <p className="text-sm">This estimate is based on {result.job_count || 'numerous'} job postings in {result.location} for this role. The actual offer may vary based on your experience, skills, and the specific employer.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!result && !loading && !error && (
              <div className="mt-8 text-center p-8 border border-gray-800 rounded-lg bg-gray-800 bg-opacity-50">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Enter job details to get started</h3>
                <p className="text-gray-500">Fill in both fields above to estimate salary ranges for your desired position</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 px-4 py-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">About Salary Estimates</h3>
          <p className="text-gray-400 mb-4">Our salary estimates are calculated based on millions of job postings and compensation data. Factors that may affect your actual salary include:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                <h4 className="text-white font-medium">Experience Level</h4>
              </div>
              <p className="text-gray-400 text-sm">Entry-level positions typically pay less than roles requiring more experience.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h4 className="text-white font-medium">Location</h4>
              </div>
              <p className="text-gray-400 text-sm">Cost of living and local market conditions can significantly impact salaries.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <h4 className="text-white font-medium">Company Size</h4>
              </div>
              <p className="text-gray-400 text-sm">Larger companies often offer higher compensation than smaller businesses or startups.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedSalary;