import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import { toast } from 'react-toastify'

function DisputeList(){
  const [disputes, setDisputes] = useState([])
  const fetch = async ()=>{
    try{ const res = await api.get('/disputes'); setDisputes(res.data||[]) }catch(e){ toast.error('Failed to load disputes') }
  }
  useEffect(()=>{fetch()}, [])
  const resolve = async (id, action)=>{
    try{ await api.put(`/disputes/${id}/resolve`, { action }) ; toast.success('Resolved'); fetch() }catch(e){ toast.error('Resolve failed') }
  }
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Disputes</h3>
      <ul>
        {disputes.map(d=> (
          <li key={d.id} className="border-b py-2 flex justify-between items-center">
            <div>#{d.id} - {d.status}</div>
            <div className="space-x-2">
              <button onClick={()=>resolve(d.id,'APPROVE')} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={()=>resolve(d.id,'REJECT')} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ReviewDashboard(){
  return (
    <Layout>
      <DisputeList />
    </Layout>
  )
}
