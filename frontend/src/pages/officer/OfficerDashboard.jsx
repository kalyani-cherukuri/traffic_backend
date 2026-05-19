import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import CreateViolationForm from '../../components/CreateViolationForm'
import { toast } from 'react-toastify'
import { getVehicles } from '../../services/vehicles'
import { getViolations } from '../../services/violations'
import { createTicket, getTickets } from '../../services/tickets'
import StatusBadge from '../../components/StatusBadge'
import { TICKET_STATUS } from '../../constants/statuses'

function IssueTicketForm({ onIssued, violations }) {
  const [vehicleId, setVehicleId] = useState('')
  const [violationId, setViolationId] = useState('')
  const [location, setLocation] = useState('')
  const [vehicles, setVehicles] = useState([])
  useEffect(()=>{
    (async ()=>{
      try{
        const v = await getVehicles();
        setVehicles(v.data || [])
      }catch(e){/* ignore */}
    })()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!vehicleId) return toast.error('Please select a vehicle')
    if (!violationId) return toast.error('Please select a violation type')
    if (!location) return toast.error('Please enter a violation location')
    try {
      await createTicket({ vehicleId: Number(vehicleId), violationTypeId: Number(violationId), violationLocation: location })
      toast.success('Ticket issued')
      setVehicleId('')
      setViolationId('')
      setLocation('')
      onIssued && onIssued()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to issue ticket')
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <h3 className="font-semibold">Issue Ticket</h3>

      <label className="block text-sm">Vehicle</label>
      <select className="w-full border px-2 py-1 rounded" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
        <option value="">Select vehicle</option>
        {vehicles.map(v=> <option key={v.id} value={v.id}>{v.vehicleNumber} — {v.vehicleType}</option>)}
      </select>

      <label className="block text-sm">Violation Type</label>
      <select className="w-full border px-2 py-1 rounded" value={violationId} onChange={e=>setViolationId(e.target.value)}>
        <option value="">Select violation</option>
        {violations.map(v=> <option key={v.id} value={v.id}>{v.violationName}</option>)}
      </select>

      <label className="block text-sm">Location</label>
      <input placeholder="Violation location" className="w-full border px-2 py-1 rounded" value={location} onChange={e=>setLocation(e.target.value)} />

      <div className="text-right"><button className="bg-blue-600 text-white px-3 py-1 rounded">Issue</button></div>
    </form>
  )
}

function ViolationHistory({ refreshKey }){
  const [tickets, setTickets] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [sortDesc, setSortDesc] = useState(true)

  const fetch = async ()=>{
    try{
      const res = await getTickets()
      setTickets(res.data || [])
    }catch(e){
      console.error(e)
      toast.error('Failed to load tickets')
    }
  }

  useEffect(()=>{ fetch() }, [refreshKey])

  const filtered = useMemo(()=>{
    let data = tickets.slice()
    if(filterStatus) data = data.filter(t => (t.ticketStatus || t.status) === filterStatus)
    if(search) data = data.filter(t => {
      const vehicle = t.vehicle?.vehicleNumber || ''
      const ticketNumber = t.ticketNumber || ''
      return vehicle.toLowerCase().includes(search.toLowerCase()) || ticketNumber.toLowerCase().includes(search.toLowerCase())
    })
    data.sort((a,b)=>{
      const da = new Date(a.createdAt || a.violationDate || null)
      const db = new Date(b.createdAt || b.violationDate || null)
      return sortDesc ? db - da : da - db
    })
    return data
  }, [tickets, filterStatus, search, sortDesc])

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Violation History</h3>
        <div className="flex items-center gap-2">
          <input placeholder="Search vehicle or ticket#" className="border px-2 py-1 rounded" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="border px-2 py-1 rounded" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="">All statuses</option>
            {TICKET_STATUS.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={()=>setSortDesc(d=>!d)} className="border px-2 py-1 rounded">Sort: {sortDesc ? 'Newest' : 'Oldest'}</button>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600"><th>Ticket#</th><th>Vehicle</th><th>Violation</th><th>Location</th><th>Fine</th><th>Status</th><th>Issued</th></tr>
        </thead>
        <tbody>
          {filtered.map(t=> (
            <tr key={t.id} className="border-t">
              <td className="py-2">{t.ticketNumber || t.id}</td>
              <td>{t.vehicle?.vehicleNumber}</td>
              <td>{t.violationType?.violationName}</td>
              <td>{t.violationLocation}</td>
              <td>{t.fineAmount ?? '-'}</td>
              <td><StatusBadge status={t.ticketStatus || t.status} /></td>
              <td>{new Date(t.createdAt || t.violationDate || '').toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function OfficerDashboard(){
  const [refreshKey, setRefreshKey] = useState(0)
  const [violations, setViolations] = useState([])
  
  useEffect(() => {
    (async () => {
      try {
        const vs = await getViolations()
        setViolations(vs.data || [])
      } catch (e) {
        /* ignore */
      }
    })()
  }, [refreshKey])
  
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <CreateViolationForm onViolationCreated={() => setRefreshKey(k => k + 1)} />
          <IssueTicketForm onIssued={() => setRefreshKey(k => k + 1)} violations={violations} />
        </div>
        <ViolationHistory refreshKey={refreshKey} />
      </div>
    </Layout>
  )
}
