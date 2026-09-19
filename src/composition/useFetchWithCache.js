import React, { useEffect, useState } from 'react'

export function useFetchWithCache(url) {
    let cache = new Map() //in memory cache
    let inFlightReq = new Map()

  const [data, setData] = useState(cache.get(url) || null)
  const [loading, setLoading] = useState(!cache.has(url))
  const [error, setError] = useState(null)

useEffect(() => {
  //if no url

  if(!url) return;

// if data is cached
if(cache.has(url)) {
    setData(cache.get(url))
    setLoading(false)
    console.log("From cache")
}

// if there is already a inFlightReq subscribe to it
if (inFlightReq.has(url)) {
  inFlightReq.get(url).then(setData).catch(setError)
  return
}

// fetch and cache

const fetchedData = fetch(url)
.then(res=> res.json())
.then(json => {
        cache.set(url,json)
        setData(json)
        console.log("No cache")
        return fetchedData    
})
.catch(err=>{
  setError(err)
  throw err
}) 
.finally(()=>{
  inFlightReq.delete(url)
  setLoading(false)
})

inFlightReq.set(url, fetchedData)

}, [url])

return {data, loading, error}

}
