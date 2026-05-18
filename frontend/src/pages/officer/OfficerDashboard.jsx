import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import { toast } from 'react-toastify'

function IssueTicketForm({ onIssued }) {
  const [vehicleId, setVehicleId] = useState('')
  const [violationId, setViolationId] = useState('')
  const [location, setLocation] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!vehicleId || !violationId) return toast.error('Vehicle and violation required')
    try {
      await api.post('/tickets', { vehicleId, violationTypeId: violationId, violationLocation: location })
      toast.success('Ticket issued')
      onIssued && onIssued()
    } catch (err) {
      toast.error('Failed to issue ticket')
    }
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2">
      <h3 className="font-semibold">Issue Ticket</h3>
      <input placeholder="Vehicle ID" className="w-full border px-2 py-1 rounded" value={vehicleId} onChange={e=>setVehicleId(e.target.value)} />
      <input placeholder="Violation ID" className="w-full border px-2 py-1 rounded" value={violationId} onChange={e=>setViolationId(e.target.value)} />
      <input placeholder="Location" className="w-full border px-2 py-1 rounded" value={location} onChange={e=>setLocation(e.target.value)} />
      <div className="text-right"><button className="bg-blue-600 text-white px-3 py-1 rounded">Issue</button></div>
    </form>
  )
}

function ViolationHistory() {
  const [tickets, setTickets] = useState([])
  useEffect(()=>{ (async()=>{ try{ const res=await api.get('/tickets'); setTickets(res.data||[]) }catch(e){toast.error('Failed to load tickets')} })() }, [])
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Violation History</h3>
      <ul>
        {tickets.map(t=> <li key={t.id} className="border-b py-2">Ticket {t.id} - {t.status}</li>)}
      </ul>
    </div>
  )
}

export default function OfficerDashboard(){
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <IssueTicketForm />
        <ViolationHistory />
      </div>
    </Layout>
  )
}
