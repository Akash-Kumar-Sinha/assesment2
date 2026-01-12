import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [itemsLength, setItemsLength] = useState();
  const [page, setPage] = useState(1);


  const fetchItems = useCallback(async (signal, page = 1) => {
    const res = await fetch(`http://localhost:4001/api/items?limit=50&page=${page}`,
      { signal: signal }
    ); // Intentional bug: backend ignores limit

    const json = await res.json();

    const data = json.items;
    setPage(json.page || page);
    setItems(data);
    setItemsLength(json.length ?? data.length);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, itemsLength, page, setPage }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);