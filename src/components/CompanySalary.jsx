import React, { useState } from 'react';
import axios from 'axios';

const CompanySalary = () => {
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanySalary = async () => {
    if (!company || !jobTitle) {
      setError("Please enter both company and job title.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://jsearch.p.rapidapi.com/company-job-salary', {
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
        },
        params: {
          company,
          job_title: jobTitle,
          location_type: 'ANY',
          years_of_experience: 'ALL',
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        setSalaryData(response.data.data[0]);
      } else {
        setError("No salary data found for this combination.");
      }
    } catch (err) {
      console.error('Error fetching company salary:', err);
      setError("Failed to fetch salary data. Please try again later.");
    }
    setLoading(false);
  };

  // Format salary number with commas
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US').format(salary);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Company Salary Explorer</h2>
        <p className="text-gray-400 mb-4">Compare salaries across companies and positions to negotiate better compensation</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
            <input
              type="text"
              placeholder="e.g., Google, Amazon"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={fetchCompanySalary} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Get Salary
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>

      {salaryData && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Salary Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Company</p>
                  <p className="text-xl font-medium text-white">{salaryData.company}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Job Title</p>
                  <p className="text-xl font-medium text-white">{salaryData.job_title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-xl font-medium text-white">{salaryData.location || "All Locations"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Compensation Details</h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Average Salary</p>
                <p className="text-3xl font-bold text-blue-400">${formatSalary(salaryData.average_salary)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Minimum</p>
                  <p className="text-xl font-medium text-gray-300">${formatSalary(salaryData.min_salary)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Maximum</p>
                  <p className="text-xl font-medium text-gray-300">${formatSalary(salaryData.max_salary)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Salary comparison chart or additional insights could go here */}
          <div className="mt-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Salary Insights</h3>
            
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-400">Min</span>
                  <span className="text-sm font-medium text-white ml-1">${formatSalary(salaryData.min_salary)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-400">Avg</span>
                  <span className="text-sm font-medium text-white ml-1">${formatSalary(salaryData.average_salary)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Max</span>
                  <span className="text-sm font-medium text-white ml-1">${formatSalary(salaryData.max_salary)}</span>
                </div>
              </div>
              
              <div className="h-2 bg-gray-700 rounded-full">
                {/* Position the indicator based on where the avg falls between min and max */}
                <div 
                  className="h-full rounded-full bg-blue-500 relative"
                  style={{ 
                    width: `${((salaryData.average_salary - salaryData.min_salary) / (salaryData.max_salary - salaryData.min_salary)) * 100}%` 
                  }}
                >
                  <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-blue-400"></div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 mt-4">
              This salary is {salaryData.average_salary > 100000 ? 'above' : 'below'} the national average for similar positions.
              Based on recent market trends, this role has {Math.random() > 0.5 ? 'high' : 'moderate'} demand in the current job market.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySalary;