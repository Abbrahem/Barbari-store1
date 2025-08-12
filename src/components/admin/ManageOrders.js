import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase/config';
import { api } from '../../utils/api';

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const apiBase = useMemo(() => process.env.REACT_APP_API_BASE || '/api', []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const fetchOrders = async () => {
    try {
      if (!user) throw new Error('Not signed in');
      const res = await api.get('/orders', { requireAuth: true });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to load orders');
      }
      const data = await res.json();
      setOrders(data.items || []);
    } catch (e) {
      Swal.fire('Error', e.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && user) {
      fetchOrders();
      const id = setInterval(fetchOrders, 10000);
      return () => clearInterval(id);
    }
  }, [authReady, user]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete order?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33'
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await api.del(`/orders/${id}`, { requireAuth: true });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete');
      }
      setOrders((prev) => prev.filter((o) => o.id !== id));
      Swal.fire('Deleted', 'Order deleted', 'success');
    } catch (e) {
      Swal.fire('Error', e.message || 'Failed to delete', 'error');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status }, { requireAuth: true });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update status');
      }
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      Swal.fire('Updated', 'Order status updated', 'success');
      fetchOrders();
    } catch (e) {
      Swal.fire('Error', e.message || 'Failed to update', 'error');
    }
  };

  if (!authReady) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
          Please sign in as admin to view orders.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">Manage Orders</h2>
          <button onClick={fetchOrders} className="px-4 py-2 bg-dark text-white rounded hover:bg-gray-800">Refresh</button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12"><p className="text-xl text-gray-600">No orders</p></div>
        ) : (
          <>
            {/* Mobile: Card list */}
            <div className="sm:hidden space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border rounded-lg p-4 shadow-sm bg-white overflow-hidden">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Order ID</div>
                      <div className="text-sm font-mono break-all">{o.id}</div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[o.status] || 'bg-gray-100 text-gray-800'}`}>{o.status}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">Customer</div>
                    <div className="text-sm font-semibold">{o.customer?.name || '—'}</div>
                    {o.customer?.email ? <div className="text-xs text-gray-600">{o.customer.email}</div> : null}
                  </div>

                  {/* Address */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="text-sm whitespace-pre-wrap break-words">{o.customer?.address || '—'}</div>
                    <div className="mt-2 text-xs text-gray-700">
                      <span className="font-semibold">Phone:</span> {o.customer?.phone1 || '—'}{o.customer?.phone2 ? `, ${o.customer.phone2}` : ''}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="text-xs text-gray-500 mb-2">Items</div>
                    <div className="space-y-2">
                      {(o.items || []).map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white border rounded overflow-hidden flex items-center justify-center">
                            <img src={it.image || it.thumbnail || ''} alt={it.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{it.name}</div>
                            <div className="text-xs text-gray-600">Size: {it.size || '—'} | Color: {it.color || '—'} | Qty: {it.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t space-y-2">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-sm font-semibold">
                      {o.total} EGP
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet: Table */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark">Address & Phones</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-dark whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{o.id}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          <div className="text-dark font-semibold">{o.customer?.name || '—'}</div>
                          <div className="text-gray-600 text-xs">{o.customer?.email || ''}</div>
                        </td>
                        <td className="py-3 px-4 text-sm max-w-xs align-top">
                          <div className="text-gray-800 whitespace-pre-wrap break-words break-all">{o.customer?.address || '—'}</div>
                          <div className="text-gray-600 text-xs mt-1">{o.customer?.phone1 || ''}{o.customer?.phone2 ? `, ${o.customer.phone2}` : ''}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex flex-col gap-2">
                            {(o.items || []).map((it, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white border rounded overflow-hidden flex items-center justify-center">
                                  {/* avoid cropping */}
                                  <img src={it.image || it.thumbnail || ''} alt={it.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div>
                                  <div className="text-dark font-semibold text-xs sm:text-sm break-words break-all">{it.name}</div>
                                  <div className="text-gray-600 text-xs whitespace-nowrap">Size: {it.size || '—'} | Color: {it.color || '—'} | Qty: {it.quantity || 1}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-red-600 whitespace-nowrap">{o.total} EGP</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatus(o.id, e.target.value)}
                            className="px-2 py-1 border rounded"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(o.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
