import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { toast } from 'react-toastify'

export default function AdminDashboard(){
  const [violations, setViolations] = useState([])
  const [payments, setPayments] = useState([])
  useEffect(()=>{ (async()=>{ try{ const v=await api.get('/violations'); setViolations(v.data||[]); const p=await api.get('/payments'); setPayments(p.data||[]) }catch(e){toast.error('Failed to load data')} })() }, [])
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">All Violations</h3>
          <ul>{violations.map(v=> <li key={v.id} className="border-b py-2">{v.name}</li>)}</ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Payments Summary</h3>
          <ul>{payments.map(p=> <li key={p.id} className="border-b py-2">{p.id} - <StatusBadge status={p.status} /></li>)}</ul>
        </div>
      </div>
    </Layout>
  )
}
