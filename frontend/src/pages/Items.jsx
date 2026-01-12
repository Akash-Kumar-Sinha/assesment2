import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../state/DataContext';
import { Skeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems, itemsLength, page, setPage } = useData();

  useEffect(() => {
    const controller = new AbortController();

    fetchItems(controller.signal, page).catch(console.error);

    return () => {
      controller.abort();
    };
  }, [fetchItems, page]);


  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center bg-white p-6 rounded-lg">
            <Skeleton height="h-6" width="w-32" className="mb-2 mx-auto " />
            <Skeleton height="h-4" width="w-20" className="mx-auto" />
          </div>
          <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="px-6 py-4">
                <Skeleton height="h-5" width="w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-2">Items</h1>
          <p className="text-sm text-gray-400">{itemsLength} items</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100 mb-8">
          {items.map((item) => (
            <ItemList key={item.id} item={item} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-400">{page}</span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={items.length < 10}
            className="text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

const ItemList = ({ item }) => {
  return (
    <Link
      to={`/items/${item.id}`}
      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <h3 className="text-gray-900 font-light">{item.name}</h3>
    </Link>
  )
}

export default Items;