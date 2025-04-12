const JobHeader = ({ title, company_name, location, type, applicationDeadline }) => {
  return (
    <div className="job-header bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 mb-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
        {title}
      </h1>

      {/* Company Name */}
      {company_name && (
        <h2 className="text-2xl font-semibold text-gray-800 mt-2">{company_name}</h2>
      )}

      {/* Location */}
      <div className="mt-4 flex items-center text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 12.414a6 6 0 10-8.486 8.486l4.242-4.242a4 4 0 015.656-5.656l1.414 1.414z"
          />
        </svg>
        <p className="text-lg font-medium">{location}</p>
      </div>

      {/* Job Type */}
      <div className="mt-2 flex items-center text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h6a2 2 0 000-4M9 13a2 2 0 010 4h6a2 2 0 010-4m2 6v-2"
          />
        </svg>
        <p className="text-lg font-medium">{type}</p>
      </div>

      {/* Application Deadline */}
      {applicationDeadline && (
        <div className="mt-2 flex items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 4h10M5 12h14m-6 4h6m-6 4h6"
            />
          </svg>
          <p className="text-lg font-medium">
            Application Deadline:{" "}
            <span className="text-red-500 font-semibold">
              {new Date(applicationDeadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default JobHeader;
