import React, {useState}  from 'react';

    export default function ApplicantDashboard()
    {
        const [user] = useState({
            name: 'Sohana',
            email: 'sohana@example.com',
            role: 'APPLICANT',
        });
    const  [activeTab, setActiveTab] = useState('browse');

    const [jobs] = useState([
        {
        id: 1,
        title: 'Senior Full-Stack Developer',
        company: 'TechCorp Solutions',
        category: 'Software Engineering',
        type: 'Full-time',
        location: 'Dhaka, Bangladesh',
        salary: '$60,000 / year',          
        },
    {
      id: 2,
      title: 'Frontend React Developer',
      company: 'InnovateX',
      category: 'Frontend Engineering',
      type: 'Remote',
      location: 'Remote',
      salary: '$45,000 / year',
    }
    ]);

    const [appliedJobs, setAppliedJobs] =useState([]);

    const handleApply = (job) => 
    {
      if(!appliedJobs.find(j => j.id === job.id))
        {
          setAppliedJobs([...appliedJobs, job]);
        }  
    };