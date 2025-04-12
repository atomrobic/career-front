import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JobHeader from "./JobHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";

const JobDetails = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Add token check utility
  const isTokenExpired = (token) => {
    try {
      console.log("Checking token expiration...");
      console.log("Raw Token:", token); // Log raw token

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded Token Payload:", tokenPayload); // Log decoded payload

      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Current Time:", currentTime);
      console.log("Token Expiration Time:", tokenPayload.exp);

      return tokenPayload.exp < currentTime;
    } catch (e) {
      console.error("Error decoding token:", e);
      return true;
    }
  };

  // Add token refresh mechanism
  const refreshToken = async () => {
    try {
      console.log("Attempting to refresh token...");

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.error("No refresh token found in localStorage.");
        throw new Error("No refresh token found");
      }

      console.log("Using Refresh Token:", refreshToken);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;
      console.log("New Access Token Received:", newAccessToken);

      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        let token = localStorage.getItem("access_token");
        console.log("Initial Access Token from localStorage:", token);

        if (!token || isTokenExpired(token)) {
          console.log("Access token expired or missing. Attempting to refresh...");
          token = await refreshToken();
          if (!token) {
            console.error("Failed to refresh token. Redirecting to login...");
            navigate("/login");
            return;
          }
          console.log("Refreshed Access Token:", token);
        } else {
          console.log("Access token is valid.");
        }

        console.log("Fetching job details with token:", token);

        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Job Details API Response:", response.data);

        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        if (error.response?.status === 401) {
          console.error("Unauthorized access. Redirecting to login...");
          navigate("/login");
        }
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let token = localStorage.getItem("access_token");
        console.log("Initial Access Token from localStorage (fetchCompanies):", token);

        if (!token || isTokenExpired(token)) {
          console.log("Access token expired or missing. Attempting to refresh...");
          token = await refreshToken();
          if (!token) {
            console.error("Failed to refresh token. Redirecting to login...");
            navigate("/login");
            return;
          }
          console.log("Refreshed Access Token:", token);
        } else {
          console.log("Access token is valid.");
        }

        console.log("Fetching companies with token:", token);

        const response = await axios.get("http://127.0.0.1:8000/api/companies/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Companies API Response:", response.data);

        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (error.response?.status === 401) {
          console.error("Unauthorized access. Redirecting to login...");
          navigate("/login");
        }
      }
    };

    fetchCompanies();
  }, [navigate]);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl text-gray-300 animate-pulse">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Section */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow">
        <div className="job-details max-w-6xl mx-auto p-8 bg-white shadow-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
          {/* Pass applicationDeadline to JobHeader */}
          <JobHeader
            title={job.title}
            location={job.location}
            company_name={job.company_name} // Ensure correct prop name
            type={job.type || job.job_type} // Ensure job type is correctly passed
            applicationDeadline={job.application_deadline}
          />

          {/* Job Details Section */}
          <section className="mt-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Job Details
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>Posted On:</strong> {new Date(job.posted_on).toLocaleDateString()} <br />
              <strong>Application Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()} <br />
              <strong>Salary:</strong> {job.salary ? `$${job.salary}` : "Not disclosed"}
            </p>
          </section>

          {/* Job Description with Read More */}
          <section className="mt-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Job Description
            </h2>
            <p
              className={`mt-4 text-gray-600 dark:text-gray-300 leading-relaxed ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {job.description}
            </p>
            <button
              onClick={toggleDescription}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </section>

          <section className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100">How to Apply</h2>

            {companies.some((company) => String(company.id) === String(job.company)) ? (
              <>
                <p className="mt-4 text-gray-300">
                  Please send your application to the following email address:
                </p>
                {companies
                  .filter((company) => String(company.id) === String(job.company))
                  .map((company) => (
                    <p key={""} className="mt-2 text-gray-300">
                      {company.email}
                    </p>
                  ))}
              </>
            ) : (
              <p className="mt-4 text-red-400">No company email available.</p>
            )}
          </section>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default JobDetails;