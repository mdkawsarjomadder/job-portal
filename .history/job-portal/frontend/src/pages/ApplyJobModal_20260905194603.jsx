import React, {useState} from "react";
import axios from "axios";


export default function ApplyJobModal({
    jobId,
    onClose,
    onSuccess
    }){
      const [file, setFile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState('');
      const [error, setError] = useState('');

      //file select and  types of validate-----------
      const handleFileChange =(e) =>{
        const selectFile = e.target.files[0];
        if(selectFile)
        {
            if(selectFile.type !== 'application/pdf'){
                setError('Only PDF files are allowed!');
                setFile(null);
                return;
            }
            setError('');
            setFile(selectFile);
        }
      };
      //form data send by backend submit-------------
      const handleSubmit = async(e) =>
      {
        e.preventDefault();
        if(!file)
        {
            setError('Please select a PDF resume.');
            return;
        }
        setLoading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('return', file);

       try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/jobs/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message || 'Application submitted successfully!');
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Apply Job Error:', err);
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

     return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl border border-slate-100 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-slate-800">Apply for Job</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Upload your PDF resume to complete the application.
        </p>

        {message && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Resume (PDF Format)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition cursor-pointer border border-slate-200 rounded-xl p-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Uploading Resume...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
      }
    