import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api'
import { createVehicle } from '../../services/vehicles'
import { createPayment, getPayments } from '../../services/payments'
import { createDispute } from '../../services/disputes'
import StatusBadge from '../../components/StatusBadge'
import { toast } from 'react-toastify'

function RegisterVehicleForm({ onCreated }) {
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!plate) return toast.error('Vehicle number is required')
    try {
      await createVehicle({ vehicleNumber: plate, vehicleType: model })
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
            <tr key={t.id} className="border-t">
              <td className="py-2">{t.id}</td>
              <td>{t.vehicle?.vehicleNumber}</td>
              <td>{t.amount}</td>
              <td><StatusBadge status={t.status} /></td>
              <td className="py-2">
                {t.status === 'PENDING_PAYMENT' && (
                  <button onClick={async()=>{ try{ await createPayment({ ticketId: t.id }); toast.success('Payment initiated'); fetch() }catch(e){toast.error('Payment failed')}}} className="bg-green-600 text-white px-2 py-1 rounded">Pay</button>
                )}
                <button onClick={async()=>{ const reason = prompt('Enter dispute reason'); if(reason){ try{ await createDispute({ ticketId: t.id, disputeReason: reason }); toast.success('Dispute raised'); fetch() }catch(e){toast.error('Dispute failed')}}}} className="ml-2 bg-yellow-600 text-white px-2 py-1 rounded">Dispute</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaymentsHistory(){
  const [payments, setPayments] = useState([])
  const fetchPayments = async ()=>{
    try{ const res = await getPayments(); setPayments(res.data||[]) }catch(e){ toast.error('Failed to load payments') }
  }
  useEffect(()=>{fetchPayments()}, [])
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Payment History</h3>
      <ul>
        {payments.map(p=> <li key={p.id} className="border-b py-2">{p.id} - {p.amount} - <StatusBadge status={p.status} /></li>)}
      </ul>
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
          <PaymentsHistory />
        </div>
      </div>
    </Layout>
  )
}
