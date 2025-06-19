import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const HOST = 'jsearch.p.rapidapi.com';

const headers = {
  'x-rapidapi-host': HOST,
  'x-rapidapi-key': API_KEY,
};

// Fetch job list
export const fetchJobs = async (query = 'developer jobs in india', page = 1, country = 'in') => {
  const { data } = await axios.get(`https://${HOST}/search`, {
    params: { query, page, num_pages: 1, country, date_posted: 'all' },
    headers,
  });
  return data.data;
};

// Fetch job details
export const fetchJobDetails = async (job_id) => {
  const { data } = await axios.get(`https://${HOST}/job-details`, {
    params: { job_id, country: 'in' },
    headers,
  });
  return data.data[0];
};

// Estimated salary lookup
export const fetchEstimatedSalary = async (title, location) => {
  try {
    const { data } = await axios.get(`https://${HOST}/estimated-salary`, {
      params: {
        job_title: title,
        location,
        location_type: 'ANY',
        years_of_experience: 'ALL',
      },
      headers,
    });

    const salary = data.data[0];

    return {
      job_title: title,
      location,
      estimated_salary: salary?.estimated_salary ?? 'N/A',
    };
  } catch (err) {
    console.error('Error in fetchEstimatedSalary:', err);
    return null;
  }
};

// Company-wise salary explorer
export const fetchCompanySalary = async (company, title) => {
  try {
    const { data } = await axios.get(`https://${HOST}/company-job-salary`, {
      params: {
        company,
        job_title: title,
        location_type: 'ANY',
        years_of_experience: 'ALL',
      },
      headers,
    });

    const salary = data.data[0];

    return {
      company,
      job_title: title,
      average_salary: salary?.average_salary ?? 'N/A',
      min_salary: salary?.min_salary ?? 'N/A',
      max_salary: salary?.max_salary ?? 'N/A',
    };
  } catch (err) {
    console.error('Error in fetchCompanySalary:', err);
    return null;
  }
};
