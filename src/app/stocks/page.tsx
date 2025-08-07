"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Search, Plus, Trash2, Loader2 } from "lucide-react";

// Sample stock data for searching
const AVAILABLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "BABA", name: "Alibaba Group Holding Limited" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "PG", name: "Procter & Gamble Company" },
  { symbol: "UNH", name: "UnitedHealth Group Incorporated" },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "MA", name: "Mastercard Incorporated" },
  { symbol: "BAC", name: "Bank of America Corporation" },
  { symbol: "DIS", name: "Walt Disney Company" },
  { symbol: "ADBE", name: "Adobe Inc." },
];

export default function StockManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  // tRPC hooks
  const { data: savedStocks, refetch } = api.stock.getAll.useQuery();
  const createStock = api.stock.create.useMutation({
    onSuccess: async () => {
      await refetch();
      setSelectedStock(null);
      setSearchQuery("");
    },
  });
  const deleteStock = api.stock.delete.useMutation({
    onSuccess: async () => await refetch(),
  });

  // Filter stocks based on search query
  const filteredStocks = AVAILABLE_STOCKS.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get saved stock symbols for filtering
  const savedSymbols = new Set(savedStocks?.map((stock) => stock.symbol) ?? []);

  const handleAddStock = () => {
    if (selectedStock) {
      createStock.mutate({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
      });
    }
  };

  const handleDeleteStock = (id: number) => {
    deleteStock.mutate({ id: id.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Stock Management
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Search and Add Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Add New Stock
            </h2>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Stock Selection */}
            {searchQuery && (
              <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className={`cursor-pointer border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-50 ${
                        selectedStock?.symbol === stock.symbol
                          ? "border-blue-200 bg-blue-50"
                          : ""
                      } ${savedSymbols.has(stock.symbol) ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {stock.symbol}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stock.name}
                          </div>
                        </div>
                        {savedSymbols.has(stock.symbol) && (
                          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
                            Already Added
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No stocks found matching {searchQuery}
                  </div>
                )}
              </div>
            )}

            {/* Selected Stock Display */}
            {selectedStock && !savedSymbols.has(selectedStock.symbol) && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900">
                      {selectedStock.symbol}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedStock.name}
                    </div>
                  </div>
                  <button
                    onClick={handleAddStock}
                    disabled={createStock.isLoading}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createStock.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Add Stock
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Stocks Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              My Stocks ({savedStocks?.length ?? 0})
            </h2>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {savedStocks && savedStocks.length > 0 ? (
                savedStocks.map((stock) => (
                  <div
                    key={stock.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {stock.symbol}
                      </div>
                      {stock.name && (
                        <div className="text-sm text-gray-600">
                          {stock.name}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteStock(stock.id)}
                      disabled={deleteStock.isLoading}
                      className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      title="Delete stock"
                    >
                      {deleteStock.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <div className="mb-2 text-lg">No stocks added yet</div>
                  <div className="text-sm">
                    Search and add stocks to get started
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
