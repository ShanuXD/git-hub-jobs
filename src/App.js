import React, { useState } from 'react';
import UseFetchJobs from './components/UseFetchJobs'
import {Container} from 'react-bootstrap'
import Job from './components/Job'
import JobPagination from './components/JobPagination';
import SearchForm from './components/SearchForm';
function App() {

  const [params,setParams]=useState({})
  const [page,setPage]=useState(1)
  const{jobs,loading,error, hasNextPage}=UseFetchJobs(params,page)

  function handelParamsCgange(e){
    const params=e.target.name
    const value=e.target.value
    setPage(1)
    setParams(prevParams=>{
      return {...prevParams,[params]:value}
    })
  }

  return (
    <Container className='my-4'>
    <h1 className='mb-4'>GitHub Jobs</h1>
    <SearchForm params={params} onParamChange={handelParamsCgange} />
    <JobPagination page={page} setPage={setPage}
      hasNextPage={hasNextPage}
    />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error!! Try Refreshing...</h1>}
      {jobs.map(job=>{
        return <Job key={job.id} job={job} />
      })}
      <JobPagination page={page} setPage={setPage}
        hasNextPage={hasNextPage}
      />
    </Container>
  );
}

export default App;
