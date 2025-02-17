import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const JobOverviewCard = ({ job }) => {
  return (
    <div style={{ 
      border: "1px solid #e0e0e0", 
      borderRadius: "12px", 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "20px auto", 
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
      background: "white"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>{job.title}</h2>
          <p style={{ margin: "5px 0", fontSize: "16px", color: "#555" }}>
            {job.company} ⭐ {job.rating} ({job.reviews} Reviews)
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "#777" }}>{job.location}</p>
        </div>
      </div>

      <p style={{ margin: "10px 0", fontSize: "14px", color: "#777" }}>
        <strong>Salary:</strong> {job.salary}
      </p>
      <p style={{ margin: "10px 0", fontSize: "14px", color: "#777" }}>
        <strong>Post Date:</strong> {job.post_date}
      </p>

      {/* Apply Button (Clickable Fix) */}
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button style={{ 
            padding: "12px 24px", 
            borderRadius: "8px", 
            backgroundColor: "#1a73e8", 
            color: "white", 
            border: "none", 
            fontSize: "16px", 
            cursor: "pointer", 
            transition: "background 0.3s ease",
            display: "inline-block" // Ensures the button is clickable
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1669c1"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#1a73e8"}>
            Apply Now
          </button>
        </a>
      </div>
    </div>
  );
};

const JobDescriptionCard = ({ job }) => {
  return (
    <div style={{ 
      border: "1px solid #e0e0e0", 
      borderRadius: "12px", 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "20px auto", 
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
      background: "white"
    }}>
      <h3 style={{ marginTop: "0", fontSize: "18px" }}>Job Description</h3>
      <div dangerouslySetInnerHTML={{ __html: job.full_description }} />
    </div>
  );
};

const KeySkillsCard = ({ job }) => {
  return (
    job.key_skills && job.key_skills.length > 0 && (
      <div style={{ 
        border: "1px solid #e0e0e0", 
        borderRadius: "12px", 
        padding: "20px", 
        maxWidth: "800px", 
        margin: "20px auto", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
        background: "white"
      }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>Key Skills</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {job.key_skills.map((skill, index) => (
            <div key={index} style={{ 
              padding: "8px 16px", 
              fontSize: "14px", 
              borderRadius: "20px", 
              backgroundColor: "#1a73e8", 
              color: "white", 
              fontWeight: "500",
              border: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)"
            }}>
              {skill}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

const FullDetailPage = () => {
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const job_id = location.state?.job_id;
  const jobUrl = location.state?.jobUrl;

  useEffect(() => {
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

    fetchJobDetails();
  }, [job_id, jobUrl]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      {loading && <p style={{ color: "#1a73e8", fontSize: "16px", textAlign: "center" }}>Loading job details...</p>}
      {error && <p style={{ color: "red", fontSize: "16px", textAlign: "center" }}>{error}</p>}
      {!loading && !error && job && (
        <>
          <JobOverviewCard job={job} />
          <JobDescriptionCard job={job} />
          <KeySkillsCard job={job} />
        </>
      )}
    </div>
  );
};

export default FullDetailPage;
