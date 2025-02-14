import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FullDetailPage = () => {
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const job_id = location.state?.job_id;
  const jobUrl = location.state?.jobUrl;

  console.log("job id: "+job_id);
    console.log("job url: "+jobUrl);
    if (!job_id || !jobUrl) {
      setError("Job details are missing.");
      return;
    }


    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/home/jobs/description/${job_id}`, {
          params: { url: jobUrl },
        });

        if (response.status === 200) {
          setJob(response.data);
        } else {
          setError("Job details not found.");
        }
      } catch (err) {
        setError("Failed to fetch job details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchJobDetails();
  }, [job_id, jobUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return job ? (
    <div>
      <h2>Job Details</h2>
      <p><strong>Title:</strong> {job.title}</p>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Rating:</strong> {job.rating}</p>
      <p><strong>Reviews:</strong> {job.reviews}</p>
      <p><strong>Post Date:</strong> {job.post_date}</p>
      <p><strong>Short Description:</strong> {job.description}</p>
      <p><strong>Full Description:</strong></p>
      <p>{job.full_description}</p>
      <p>
        <strong>Job Link:</strong>{" "}
        <a href={job.url} target="_blank" rel="noopener noreferrer">
          {job.url}
        </a>
      </p>
    </div>
  ) : null;
};

export default FullDetailPage;
