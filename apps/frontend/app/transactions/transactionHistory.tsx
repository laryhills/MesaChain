"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Calendar, Filter, Download, Search } from 'lucide-react';
import {
  initialTransactionItems,
  getStatusColor,
  getWalletColor,
  TransactionItems
} from './transactionHelpers';

export default function TransactionHistoryTable() {

    const [transactions, setTransactions] = useState<TransactionItems[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [sortDescending, setSortDescending] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [showFilters, setShowFilters] = useState(false);  
    const filterRef = useRef<HTMLDivElement>(null);
    const [downloaded, setDownloaded] = useState(false);
    const [search, setSearch] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 10;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setTransactions(initialTransactionItems);
       try {
     setTransactions(initialTransactionItems);
   } catch (error) {
     console.error('Failed to load transactions:', error);
   }
    }, []);

    useEffect(() => {
      setCurrentPage(1); 
  }, [selectedDate, selectedStatus, selectedWallet, search]);

    const exportCSV = () => {
        const header = ['Stellar Address', 'DateTime', 'Amount XLM', 'Amount USD', 'Fee', 'Status', 'Wallet'];
        const rows = transactions.map(item => [
            item.stellarAddress,
            new Date(item.time).toLocaleString(),
            item.amountXLM,
            item.amountUSD,
            item.fee,
            item.status,
            item.wallet
        ]);
        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `transactions_${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };



    const copyStellarAddress = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 3000);
  };

    const sortByTime = () => {
        const sorted = [...transactions].sort((a, b) => {
            const dateA = new Date(a.time).getTime();
            const dateB = new Date(b.time).getTime();
            return sortDescending ? dateB - dateA : dateA - dateB;
        });
        setTransactions(sorted);
        setSortDescending(!sortDescending);
    };

    const filteredTransactions = transactions.filter(item => {
        const matchesDate = selectedDate ? new Date(item.time).toISOString().split('T')[0] === selectedDate : true;
        const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
        const matchesWallet = selectedWallet ? item.wallet === selectedWallet : true;
        const matchesAddress = search ? item.stellarAddress.toLowerCase().includes(search.toLowerCase()) : true;
        return matchesDate && matchesStatus && matchesWallet && matchesAddress;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage); 
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
      <div className="w-full text-sm">
      <h2 className="text-xl sm:text-2xl font-semibold mb-5">Transactions History</h2>
      <div className="relative w-full mb-5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                    <input
                        type="text"
                        placeholder="Search Stellar address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"/>
                
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Calendar size={14} /> Date:</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4A340] focus:border-[#F4A340] transition"
          />
        </div>

        <div ref={filterRef} className="relative">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Filter size={14} /> Filters:</label>
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="text-sm px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 shadow-sm transition">
            Select
          </button>

          {showFilters && (
            <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg p-4 space-y-3">
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A340] transition"
                >
                  <option value="">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">Wallet:</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A340] transition">
                  <option value="">All</option>
                  <option value="xBull">xBull</option>
                  <option value="Freighter">Freighter</option>
                  <option value="Albedo">Albedo</option>
                  <option value="Rabet">Rabet</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedDate('');
                  setSelectedStatus('');
                  setSelectedWallet('');
                  setShowFilters(false);
                }}
                className="w-full text-sm mt-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
                Clean filters
              </button>

    </div>
  )}
        </div>

        <div className="ml-auto mt-6 flex flex-col items-end gap-1">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#F4A340] rounded-md shadow hover:bg-[#e3932f] transition">
            <Download size={14} /> Export CSV
          </button>
          {downloaded && (
            <span className="text-green-600 text-xs">Downloaded file ✅</span> 
          )}
        </div>
      </div>


    <div className="w-full overflow-x-auto border border-gray-300 text-sm">
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead>
          <tr className="bg-[#F4A340] text-white uppercase tracking-wider">
            <th className=" px-3 py-2 ">Stellar Address</th>
            <th className=" px-3 py-2 cursor-pointer" onClick={sortByTime}>Time
            <span className="ml-2">{sortDescending ? '↓' : '↑'}</span>
            </th>
            <th className=" px-3 py-2 ">Amount XLM</th>
            <th className=" px-3 py-2 ">Amount USD</th>
            <th className=" px-3 py-2 ">Fee</th>
            <th className=" px-3 py-2 ">Status</th>
            <th className=" px-3 py-2 ">Wallet</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
     
        {paginatedTransactions.length === 0 ? (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
        There are no transactions with the selected data.
      </td>
    </tr>
              ): (
                paginatedTransactions.map((item, idx) => (
                  <tr key={idx} className="text-center hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span className="text-[#ff7f16] font-medium uppercase relative">{item.stellarAddress}
                        <button
                          onClick={() => copyStellarAddress(item.stellarAddress, idx)}
                          className="ml-3 text-gray-400 hover:text-gray-600 text-sm focus:outline-none"
                          title="Copy address">
                    <Copy size={14} className="text-gray-600" />
                    {copiedIndex === idx && (
                            <span className="absolute -top-6 left-0 text-xs text-white bg-gray-700 rounded px-2 py-1 shadow-md animate-fade-in-out">
                              Copied!
                            </span>
                          )}
              </button>
              </span>
              </td>
              <td className=" px-3 py-2">{new Date(item.time).toLocaleTimeString([], { year: 'numeric',month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}</td>
              <td className=" px-3 py-2 font-bold">{item.amountXLM} XLM</td>
              <td className=" px-3 py-2">${item.amountUSD.toFixed(2)}</td>
              <td className=" px-3 py-2">{item.fee} XLM</td>
              <td className=" px-3 py-2">
              <span className={`inline-flex px-2 sm:px-2.5 py-1 rounded-[4px] text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className=" px-3 py-2 capitalize"><span className={"inline-block w-2 h-2 rounded-full mr-2"} style={{ backgroundColor: getWalletColor(item.wallet) }}></span>
               {item.wallet}</td>
            </tr>
          )))}
        </tbody>
      </table>
      </div>
      {totalPages > 1 && (
  <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50">
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 border rounded text-sm ${
          currentPage === index + 1
            ? 'bg-[#F4A340] text-white'
            : 'bg-white hover:bg-gray-100'
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
    >
      Next
    </button>
  </div>
      )}
    </div>
    );
  };
