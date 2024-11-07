import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MdStarRate } from "react-icons/md";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoLocationOutline } from "react-icons/io5";

const FullDetailPage = () => {
  const location = useLocation();
  const jobUrl = location.state?.jobUrl; // Extract job URL from state

  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!jobUrl) {
    console.warn("Job URL is missing.");
    setError("Job URL is missing.");
    return;
  }

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching job details from:", jobUrl);  // Log URL for debugging
      const response = await axios.get("http://10.162.4.167:5000/getJobDescription", {
        params: { job_url: jobUrl },
      });

      if (response.data) {
        setJobDetails(response.data);
      } else {
        console.error("Invalid data format received from server.");
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to fetch job details: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
    fetchJobDetails(); // Call the async function
  }, [jobUrl]); // Only re-run if jobUrl changes

  // Function to process and format the description
  const formatJobDescription = (description) => {
    if (!description) return <p>No description available.</p>;
    
    const lines = description.split("\n");
    const formattedDescription = [];
    let currentHeading = "";
    let contentList = [];
    const headings = ["Responsibilities", "Key Skills", "Requirements", "Experience", "Qualifications", "Education", "Job Description"];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (headings.some((heading) => trimmedLine.toLowerCase().includes(heading.toLowerCase()) && trimmedLine.length < 25)) {
        if (contentList.length) {
          formattedDescription.push(
            <div key={currentHeading}>
              <h4 className="text-xl font-semibold">{currentHeading}</h4>
              <ul className="list-disc pl-5">
                {contentList.map((content, idx) => (
                  <li key={idx} className="text-gray-800">{content}</li>
                ))}
              </ul>
            </div>
          );
          contentList = [];
        }
        currentHeading = trimmedLine;
      } else {
        if (trimmedLine) {
          contentList.push(trimmedLine);
        }
      }
    });

    if (contentList.length) {
      formattedDescription.push(
        <div key={currentHeading}>
          <h4 className="text-xl font-semibold">{currentHeading}</h4>
          <ul className="list-disc pl-5">
            {contentList.map((content, idx) => (
              <li key={idx} className="text-gray-800">{content}</li>
            ))}
          </ul>
        </div>
      );
    }

    return formattedDescription.length ? formattedDescription : <p>No specific sections found in the job description.</p>;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {jobDetails ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{jobDetails.title}</h2>
          <div className="flex mb-4 gap-6">
            <p className="text-gray-700"><strong></strong> {jobDetails.company}</p>
            <p className="text-gray-700 flex items-center gap-1">
              <MdStarRate className="text-yellow-500" size={20} />
              <span>{jobDetails.rating}</span>
            </p>
            <p className="text-gray-700">{jobDetails.reviews}</p>
          </div>

          <div className="flex gap-6 mb-4">
            <p className="text-gray-700 flex items-center">
              <IoLocationOutline size={20} />
              <span>{jobDetails.location}</span>
            </p>
            <p className="text-gray-700 flex items-center">
              <LiaRupeeSignSolid size={20} />
              <span>{jobDetails.salary}</span>
            </p>
          </div>

          <div className="flex gap-6 mb-4">
            <p className="text-gray-700"><strong>Posted:</strong> {jobDetails.post_date}</p>
            <p className="text-gray-700"><strong>Openings:</strong> {jobDetails.openings}</p>
            <p className="text-gray-700"><strong>Applicants:</strong> {jobDetails.applicants}</p>
          </div>

          <div className="flex justify-between">
            <h3 className="text-xl font-semibold mt-6 mb-2">Job Description</h3>
            <a href={jobDetails.link} target="_blank" rel="noopener noreferrer">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
                Apply Now
              </button>
            </a>
          </div>
          {formatJobDescription(jobDetails.description)}
        </div>
      ) : (
        <p>Job details not available.</p>
      )}
    </div>
  );
};

export default FullDetailPage;
