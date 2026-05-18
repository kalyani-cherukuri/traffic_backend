import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { toast } from 'react-toastify'

function RegisterVehicleForm({ onCreated }) {
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!plate) return toast.error('Plate is required')
    try {
      await api.post('/vehicles', { plateNumber: plate, model })
      toast.success('Vehicle registered')
      setPlate('')
      setModel('')
      onCreated && onCreated()
    } catch (err) {
      toast.error('Failed to register vehicle')
    }
  }
  return (
    <form onSubmit={submit} className="space-y-2 bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Register Vehicle</h3>
      <input placeholder="Plate" value={plate} onChange={e=>setPlate(e.target.value)} className="w-full border px-2 py-1 rounded" />
      <input placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} className="w-full border px-2 py-1 rounded" />
      <div className="text-right"><button className="bg-green-600 text-white px-3 py-1 rounded">Register</button></div>
    </form>
  )
}

function TicketsTable() {
  const [tickets, setTickets] = useState([])
  const fetch = async () => {
    try {
      const res = await api.get('/tickets')
      setTickets(res.data || [])
    } catch (err) {
      toast.error('Failed to load tickets')
    }
  }
  useEffect(()=>{fetch()}, [])
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Your Tickets</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600"><th>Id</th><th>Vehicle</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {tickets.map(t=> (
            <tr key={t.id} className="border-t"><td className="py-2">{t.id}</td><td>{t.vehicle?.plateNumber}</td><td>{t.amount}</td><td><StatusBadge status={t.status} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CitizenDashboard() {
  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <RegisterVehicleForm />
        </div>
        <div className="md:col-span-2 space-y-4">
          <TicketsTable />
        </div>
      </div>
    </Layout>
  )
}
