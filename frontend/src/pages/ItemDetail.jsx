import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Skeleton } from '../components/Skeleton';
import { ArrowLeft } from 'lucide-react';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    console.log("id: ", id);

    fetch('http://localhost:4001/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setItem(data);
        setIsLoading(false);
      })
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (isLoading || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton height="h-6" width="w-32" className="mb-4" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <Skeleton height="h-10" width="w-2/3" className="mb-6" />
          <div className="space-y-4">
            <div>
              <Skeleton height="h-5" width="w-24" className="mb-2" />
              <Skeleton height="h-6" width="w-40" />
            </div>
            <div>
              <Skeleton height="h-5" width="w-24" className="mb-2" />
              <Skeleton height="h-6" width="w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-light text-gray-900 mb-8">
            {item.name}
          </h1>

          <div className="space-y-6">
            <div>
              <div className="text-xs text-gray-400 mb-1">Category</div>
              <div className="text-gray-900">{item.category}</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Price</div>
              <div className="text-2xl font-light text-gray-900">${item.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;