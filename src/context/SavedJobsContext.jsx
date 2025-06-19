import { createContext, useContext, useState, useEffect } from "react";

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState(() => {
    const stored = localStorage.getItem("savedJobs");
    return stored ? JSON.parse(stored) : [];
  });

  const saveJob = (job) => {
    if (!savedJobs.find((j) => j.job_id === job.job_id)) {
      const updated = [...savedJobs, job];
      setSavedJobs(updated);
      localStorage.setItem("savedJobs", JSON.stringify(updated));
    }
  };

  const unsaveJob = (jobId) => {
    const updated = savedJobs.filter((job) => job.job_id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, unsaveJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);
