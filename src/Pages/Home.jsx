import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import axios from "axios";
// import dotenv from "dotenv"
import { useNavigate } from "react-router-dom";
import { CgLayoutGrid } from "react-icons/cg";
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [jobs, setJobs] = useState([]); // State to store the job data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); 
  // require('dotenv').config();

   // Handle form submission for search
   const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    setError(""); // Reset previous errors

    try {
      // Make a request to Spring API using axios

      const response = await axios.get(`https://jobnet-springboot.onrender.com/home/jobs`, {
        params: {
          title: searchQuery, // Send the search query to Flask
          minSalary: 0,
        },
      });

      console.log("title: "+title)
      console.log("salary: "+minSalary)
      

      // Check if response data is an array of jobs
      if (Array.isArray(response.data)) {
        // Set the job data received from Flask into the state
        setJobs(response.data);
        localStorage.setItem("jobs", JSON.stringify(response.data)); // Store jobs in localStorage
      } else {
        setError("Invalid data format received from server."); // Handle invalid response format
      }
    } catch (err) {
      setError("Failed to fetch jobs: " + err.message); // Handle errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
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
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded-r-full"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading and Error handling */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Job Cards */}
      <div className="grid grid-cols-3 gap-4 mx-auto mt-10 w-10/12">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.job_id} job={job} navigate={navigate}/>)
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  const navigate = useNavigate(); 
  const handleCardClick = () => {
    // Navigate to job details with state
    console.log("\njob link: ",job.link)
    navigate("/jobdetails", { state: { jobUrl: job.link } });
  };
  return (
      <div className=" rounded overflow-hidden shadow-lg bg-white p-6 mb-4 cursor-pointer" onClick={handleCardClick}>
        {/* Job Title */}
        <div className="font-bold text-xl mb-2">{job.title}</div>

        {/* Company Name & Location */}
        <div className="flex justify-between items-center">
          <p className="text-gray-700 text-base">{job.company}</p>
          <span className="flex items-center text-gray-500">
            <IoLocationOutline className="inline mr-1" /> {job.location}
          </span>
        </div>

        {/* Salary and Reviews */}
        <div className="flex justify-between mt-2">
          <p className="text-gray-500 text-sm">{job.salary}</p>
          <p className="text-gray-500 text-sm">
            Reviews: {job.reviews || "N/A"}
          </p>
        </div>

        <div className="flex justify-between mt-2">
          <p className="text-gray-500 text-sm">{job.rating}</p>
        </div>
        <div>
          <p>{job.shortDescription}</p>
        </div>

        <div>
          <p>{job.post_date}</p>
        </div>
      </div>
  );
};

export default HomePage;
