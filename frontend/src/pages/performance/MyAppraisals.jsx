import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaComments, FaStar, FaSave } from "react-icons/fa";

const MyAppraisals = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [ratings, setRatings] = useState([
    { criteria: 'Job Knowledge & Skills', score: 0, comment: '' },
    { criteria: 'Quality of Work', score: 0, comment: '' },
    { criteria: 'Communication & Teamwork', score: 0, comment: '' },
    { criteria: 'Problem Solving & Initiative', score: 0, comment: '' },
  ]);
  const [overallFeedback, setOverallFeedback] = useState('');

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const fetchAppraisals = async () => {
    try {
      const res = await axios.get("/performance/appraisals/my", { withCredentials: true });
      setAppraisals(res.data);
    } catch (err) {
      toast.error("Failed to fetch appraisals");
    }
  };

  const openAppraisal = (app) => {
    setSelectedAppraisal(app);
    if (app.ratings && app.ratings.length > 0) {
      setRatings(app.ratings);
      setOverallFeedback(app.overallFeedback || '');
    } else {
      setRatings([
        { criteria: 'Job Knowledge & Skills', score: 0, comment: '' },
        { criteria: 'Quality of Work', score: 0, comment: '' },
        { criteria: 'Communication & Teamwork', score: 0, comment: '' },
        { criteria: 'Problem Solving & Initiative', score: 0, comment: '' },
      ]);
      setOverallFeedback('');
    }
  };

  const handleRatingChange = (idx, field, value) => {
    const updated = [...ratings];
    updated[idx][field] = value;
    setRatings(updated);
  };

  const submitReview = async () => {
    const overallScore = (ratings.reduce((acc, curr) => acc + Number(curr.score), 0) / ratings.length).toFixed(1);
    try {
      await axios.put(`/performance/appraisals/${selectedAppraisal._id}`, {
        ratings,
        overallScore,
        overallFeedback
      }, { withCredentials: true });
      toast.success("Review submitted successfully!");
      setSelectedAppraisal(null);
      fetchAppraisals();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <FaComments className="text-4xl text-orange-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">My Appraisals</h1>
          <p className="text-gray-500">Provide self, peer, or direct report feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Pending Reviews</h2>
          {appraisals.length === 0 && <div className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">No appraisals assigned to you.</div>}
          {appraisals.map(app => (
            <div 
              key={app._id} 
              onClick={() => openAppraisal(app)}
              className={`p-4 rounded-xl border cursor-pointer transition ${selectedAppraisal?._id === app._id ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-100 hover:border-orange-200'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${app.type === 'Self' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {app.type} Review
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${app.status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {app.status}
                </span>
              </div>
              <div className="font-bold text-gray-800 mt-2">Target: {app.employeeId.name}</div>
              <div className="text-xs text-gray-500">{app.cycleId?.name}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedAppraisal ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedAppraisal.type} Review</h2>
                  <p className="text-gray-500 font-medium">Reviewing: {selectedAppraisal.employeeId.name}</p>
                </div>
                {selectedAppraisal.overallScore && (
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold text-lg flex items-center gap-2">
                    <FaStar /> {selectedAppraisal.overallScore}/5
                  </div>
                )}
              </div>

              {selectedAppraisal.status === 'Submitted' && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-semibold mb-6">
                  This review has been submitted and is locked.
                </div>
              )}

              <div className="space-y-6">
                {ratings.map((r, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-gray-700">{r.criteria}</h3>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            disabled={selectedAppraisal.status === 'Submitted'}
                            onClick={() => handleRatingChange(idx, 'score', num)}
                            className={`w-8 h-8 rounded-full font-bold text-sm transition ${
                              r.score >= num ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-orange-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea 
                      placeholder="Add comments for this criteria..."
                      disabled={selectedAppraisal.status === 'Submitted'}
                      value={r.comment}
                      onChange={e => handleRatingChange(idx, 'comment', e.target.value)}
                      className="w-full p-2.5 text-sm bg-white border border-gray-200 rounded focus:ring-1 focus:ring-orange-500 transition disabled:bg-gray-100"
                    />
                  </div>
                ))}

                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Overall Feedback</h3>
                  <textarea 
                    rows="4"
                    disabled={selectedAppraisal.status === 'Submitted'}
                    placeholder="Provide a comprehensive summary..."
                    value={overallFeedback}
                    onChange={e => setOverallFeedback(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 transition disabled:bg-gray-100"
                  />
                </div>

                {selectedAppraisal.status !== 'Submitted' && (
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={submitReview}
                      className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
                    >
                      <FaSave /> Submit Final Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl h-full min-h-[400px] flex items-center justify-center text-gray-400 font-medium">
              Select an appraisal from the left to start reviewing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppraisals;
