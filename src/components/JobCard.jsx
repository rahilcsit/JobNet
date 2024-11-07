import React from "react";
import { IoLocationOutline } from "react-icons/io5";


const JobCard = ({ job }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 mb-4">
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
        <p className="text-gray-500 text-sm">Reviews: {job.reviews || "N/A"}</p>
      </div>

      
    </div>
  );
};

export default JobCard;
