import React, { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 

  // Fetch jobs on page load
  useEffect(() => {
    fetchJobsOnPageLoad(); 
  }, []);

  // Fetch jobs from backend
  const fetchJobsOnPageLoad = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8080/home", {
      });

      if (Array.isArray(response.data)) {
        setJobs(response.data);
        localStorage.setItem("jobs", JSON.stringify(response.data));
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError("Failed to fetch jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (query) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8080/home/jobs", {
        params: { title: query, minSalary: 0 },
      });

      if (Array.isArray(response.data)) {
        setJobs(response.data);
        localStorage.setItem("jobs", JSON.stringify(response.data));
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError("Failed to fetch jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent accidental double events
    fetchJobs(searchQuery);
  };

  return (
    <div>
      {/* Search bar */}
      <div className="flex justify-center mt-36">
        <form className="flex w-1/2" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search for jobs"
            className="border border-gray-300 rounded-l-full px-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-r-full">
            Search
          </button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Job Cards */}
      <div className="grid grid-cols-3 gap-4 mx-auto mt-10 w-10/12">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} navigate={navigate} />)
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

const JobCard = ({ job, navigate }) => {
  const handleCardClick = () => {
    navigate("/jobdetails", {
      state: { job_id: job.id, jobUrl: job.link },
    });
  };

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white p-6 mb-4 cursor-pointer" onClick={handleCardClick}>
      <div className="font-bold text-xl mb-2">{job.title}</div>
      <div className="flex justify-between items-center">
        <p className="text-gray-700 text-base">{job.company}</p>
        <span className="flex items-center text-gray-500">
          <IoLocationOutline className="inline mr-1" /> {job.location}
        </span>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-gray-500 text-sm">{job.salary}</p>
        <p className="text-gray-500 text-sm">Reviews: {job.reviews || "N/A"}</p>
      </div>
      <div className="text-gray-500 text-sm mt-2">{job.rating}</div>
      <p>{job.shortDescription}</p>
      <p>{job.post_date}</p>
    </div>
  );
};

export default HomePage;
