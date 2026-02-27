import React from "react";
import { Link } from "react-router-dom";

export default function ResumeBuilder() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Build Your Resume</h1>
      <div className="space-y-6">
        <Link to="/resume/upload" className="block p-4 rounded-lg border hover:bg-gray-50">
          <div className="font-semibold text-lg">Use Existing Resume</div>
          <div className="text-gray-500 text-sm">Upload your old resume to update or improve it.</div>
        </Link>
        <Link to="/resume/new" className="block p-4 rounded-lg border hover:bg-gray-50">
          <div className="font-semibold text-lg">Build New Resume</div>
          <div className="text-gray-500 text-sm">Start from scratch and create a new resume.</div>
        </Link>
        <Link to="/resume/ats" className="block p-4 rounded-lg border hover:bg-gray-50">
          <div className="font-semibold text-lg">Check ATS Score</div>
          <div className="text-gray-500 text-sm">Analyze your resume for ATS compatibility and get tips to improve.</div>
        </Link>
      </div>
    </div>
  );
}
