import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home()
    {
      const [jobs, setJobs] = useState([]);
      const [loading, setLoading] = useState(true);
      
      //search in job category-----
      const [search, setSearch] = useState('');
      const [category, setCategory] = useState('');
      const [location, setLocation] = useState('');
      const [jobType, setJobType] = useState('');

    useEffect(() =>
    {
        fetchJobs();
    }, [search, category, loading,jobType]);

    const fetchJobs = async() =>
    {
        setLoading(true);
        try{
            const res = await axios.get('http://localhost:5000/api/jobs', {
                params:{search, category, location, jobType},
            });
            setJobs(res.data);
        }
        catch(err)
        {
            console.error('Error fetching jobs:', err);
        }
        finally
        {
            setLoading(false);
        }
    };

   const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setJobType('');
  };

  return(
    <div className="min-h-screen bg-slate-50 font-sans text-left pb-12">
        {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-14 px-4 sm:px-8 mb-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Find Your <span className="text-purple-400">Dream Job</span> Today
          </h1>
          <p className="text-purple-200/90 text-sm sm:text-base max-w-xl mx-auto">
            Explore thousands of job opportunities from top companies and kickstart your career now.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8"></div>
    </div>
  )
    };