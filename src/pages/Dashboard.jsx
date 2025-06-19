import { useState } from 'react';
import { fetchEstimatedSalary, fetchCompanySalary } from '../utils/api';
import InternshipList from '../components/InternshipList';

const Dashboard = () => {
  const [jobTitle, setJobTitle] = useState(''); 
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const [company, setCompany] = useState('');
  const [companyJobTitle, setCompanyJobTitle] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);

  const handleEstimate = async () => {
    if (!jobTitle || !location) {
      alert('Please enter both job title and location');
      return;
    }
    setIsEstimating(true);
    try {
      const result = await fetchEstimatedSalary(jobTitle, location);
      setSalary(result);
    } catch (error) {
      console.error('Error fetching salary estimate:', error);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleCompanySalary = async () => {
    if (!company || !companyJobTitle) {
      alert('Please enter both company and job title');
      return;
    }
    setIsCompanyLoading(true);
    try {
      const result = await fetchCompanySalary(company, companyJobTitle);
      setCompanyData(result);
    } catch (error) {
      console.error('Error fetching company salary:', error);
    } finally {
      setIsCompanyLoading(false);
    }
  };

  // Format salary with commas
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Career Dashboard</h1>
          <p className="text-gray-400">Track opportunities, compare salaries, and advance your career</p>
        </header>

        {/* Recent Internships Section */}
        <section className="mb-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="border-b border-gray-700 bg-gray-800 bg-opacity-50 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Recent Internships
            </h2>
          </div>
          <div className="p-6">
            <InternshipList searchQuery="internship" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estimated Salary Section */}
          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="border-b border-gray-700 bg-gray-800 bg-opacity-50 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Estimated Salary Lookup
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Data Analyst"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., New York, San Francisco"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <button 
                  onClick={handleEstimate} 
                  disabled={isEstimating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {isEstimating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Estimating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      Get Estimated Salary
                    </>
                  )}
                </button>
              </div>

              {salary && (
                <div className="mt-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{salary.job_title}</h3>
                    <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                      {salary.location}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-1">Estimated Salary</p>
                    <p className="text-3xl font-bold text-green-400">${formatSalary(salary.estimated_salary)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-400 mb-1">Minimum</p>
                      <p className="text-xl font-medium text-gray-200">${formatSalary(salary.min_salary)}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-400 mb-1">Maximum</p>
                      <p className="text-xl font-medium text-gray-200">${formatSalary(salary.max_salary)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Company Salary Explorer Section */}
          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="border-b border-gray-700 bg-gray-800 bg-opacity-50 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Company Salary Explorer
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Google, Amazon, Microsoft"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={companyJobTitle}
                    onChange={(e) => setCompanyJobTitle(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <button 
                  onClick={handleCompanySalary} 
                  disabled={isCompanyLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {isCompanyLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      Get Company Salary
                    </>
                  )}
                </button>
              </div>

              {companyData && (
                <div className="mt-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{companyData.company}</h3>
                      <p className="text-purple-400">{companyData.job_title}</p>
                    </div>
                    {companyData.logo_url && (
                      <img 
                        src={companyData.logo_url} 
                        alt={`${companyData.company} logo`} 
                        className="h-10 w-10 object-contain bg-gray-700 p-1 rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-1">Average Salary</p>
                    <p className="text-3xl font-bold text-purple-400">${formatSalary(companyData.average_salary)}</p>
                  </div>
                  
                  {/* Salary Range Visualization */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">${formatSalary(companyData.min_salary)}</span>
                      <span className="text-sm text-gray-400">${formatSalary(companyData.max_salary)}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div 
                        className="h-full rounded-full bg-purple-500 relative"
                        style={{ 
                          width: `${((companyData.average_salary - companyData.min_salary) / (companyData.max_salary - companyData.min_salary)) * 100}%` 
                        }}
                      >
                        <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-purple-400"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-400 mb-1">Minimum</p>
                      <p className="text-xl font-medium text-gray-200">${formatSalary(companyData.min_salary)}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-400 mb-1">Maximum</p>
                      <p className="text-xl font-medium text-gray-200">${formatSalary(companyData.max_salary)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;