import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase/config';
import { api } from '../../utils/api';

const ManageProducts = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.items || []);
    } catch (e) {
      Swal.fire('Error', e.message || 'Failed to load products', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
    const id = setInterval(fetchProducts, 10000); // refresh every 10s
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        if (!user) throw new Error('Not signed in');
        const res = await api.del(`/products/${productId}`, { requireAuth: true });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Delete failed');
        }
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        Swal.fire('Deleted!', 'Product deleted successfully.', 'success');
        // quick refresh to ensure latest list
        fetchProducts();
      } catch (e) {
        Swal.fire('Error', e.message || 'Failed to delete', 'error');
      }
    });
  };

  const handleUpdate = (product) => {
    if (onEdit) {
      onEdit(product);
    } else {
      setEditingProduct(product);
      console.log('Update product:', product);
    }
  };

  const toggleSoldOut = async (product, nextValue) => {
    try {
      if (!user) throw new Error('Not signed in');
      // optimistic UI update
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, soldOut: nextValue } : p)));
      const res = await api.patch(`/products/${product.id}/soldout`, { soldOut: nextValue }, { requireAuth: true });
      if (!res.ok) {
        // revert on failure
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, soldOut: !nextValue } : p)));
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update SOLD OUT');
      }
    } catch (e) {
      Swal.fire('Error', e.message || 'Failed to update SOLD OUT', 'error');
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      't-shirt': 'T-Shirt',
      'pants': 'Pants'
    };
    return categories[category] || 'Uncategorized';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">Manage Products</h2>
          <button onClick={fetchProducts} className="px-4 py-2 bg-dark text-white rounded hover:bg-gray-800">Refresh</button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products available</p>
          </div>
        ) : (
          <>
            {/* Mobile: Card grid */}
            <div className="sm:hidden grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm overflow-hidden">
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full bg-white border rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={product.thumbnail || (product.images && product.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0iI2VlZWVlZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0iI2Y0ZjRmNCIvPjxnIG9wYWNpdHk9Ii42Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjI4IiByPSIxMiIgZmlsbD0iI2Q1ZDVkNSIvPjxyZWN0IHg9IjE2IiB5PSIzOCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjZDVkNWQ1Ii8+PC9nPjwvc3ZnPg=='}
                        alt={product.name}
                        className="w-full max-h-48 object-contain"
                      />
                    </div>

                    {/* Divider */}
                    <div className="mt-3 border-t" />

                    {/* Name + Price */}
                    <h3 className="mt-3 font-semibold text-dark text-base break-words break-all leading-snug">{product.name}</h3>
                    <div className="mt-1 inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-sm font-semibold w-fit">{product.price} EGP</div>

                    {/* Description */}
                    {product.description ? (
                      <>
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">{product.description}</p>
                        <div className="mt-3 border-t" />
                      </>
                    ) : (
                      <div className="mt-3 border-t" />
                    )}

                    {/* Sizes */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Available Sizes</div>
                      <div className="flex flex-wrap gap-1">
                        {(product.sizes || []).length > 0 ? (
                          (product.sizes || []).map((size) => (
                            <span key={size} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px]">{size}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-3 border-t" />

                    {/* Colors */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Available Colors</div>
                      <div className="flex flex-wrap gap-1">
                        {(product.colors || []).length > 0 ? (
                          (product.colors || []).map((color) => (
                            <span key={color} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-[11px]">{color}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-3 border-t" />
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleUpdate(product)}
                      className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                    {/* SOLD OUT toggle */}
                    <label className="mt-1 inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!product.soldOut}
                        onChange={(e) => toggleSoldOut(product, e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-dark">SOLD OUT</span>
                      {product.soldOut && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-dark">Image</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Product Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Sizes</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Colors</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">Actions</th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">SOLD OUT</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={product.thumbnail || (product.images && product.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0iI2VlZWVlZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0iI2Y0ZjRmNCIvPjxnIG9wYWNpdHk9Ii42Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjI4IiByPSIxMiIgZmlsbD0iI2Q1ZDVkNSIvPjxyZWN0IHg9IjE2IiB5PSIzOCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjZDVkNWQ1Ii8+PC9nPjwvc3ZnPg=='}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <h3 className="font-semibold text-dark">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-red-600">{product.price} EGP</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-gray-100 text-dark rounded-full text-sm">
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(product.sizes || []).map((size) => (
                            <span key={size} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(product.colors || []).map((color) => (
                            <span key={color} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {color}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(product)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!product.soldOut}
                            onChange={(e) => toggleSoldOut(product, e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-semibold text-dark">SOLD OUT</span>
                          {product.soldOut && (
                            <span className="text-green-600 text-sm">✓</span>
                          )}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
