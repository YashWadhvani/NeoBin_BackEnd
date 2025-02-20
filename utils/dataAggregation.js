// src/utils/aggregationUtils.js

// Helper: Group data by time unit
const groupBy = (data, getKey) => {
    return data.reduce((acc, item) => {
      const key = getKey(new Date(item.timestamp));
      acc[key] = acc[key] || { key, total: 0, count: 0 };
      acc[key].total += item.value;
      acc[key].count += 1;
      return acc;
    }, {});
  };
  
  // Hourly Aggregation (last 24 hours)
  const getHourlyAvg = (data) => {
    if (!data || data.length === 0) return [];
  
    const last24Hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const filteredData = data.filter((d) => new Date(d.timestamp) >= last24Hrs);
  
    const groupedData = groupBy(filteredData, (date) => `${date.getHours()}:00`);
  
    return Object.values(groupedData).map((h) => ({
      hour: h.key,
      average: h.total / h.count,
    }));
  };
  
  // Daily Aggregation (last 7 days)
  const getDailyAvg = (data) => {
    if (!data || data.length === 0) return [];
  
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const filteredData = data.filter((d) => new Date(d.timestamp) >= last7Days);
  
    const groupedData = groupBy(filteredData, (date) => date.toISOString().split("T")[0]);
  
    return Object.values(groupedData).map((d) => ({
      date: d.key,
      average: d.total / d.count,
    }));
  };
  
  // Monthly Aggregation (last 12 months)
  const getMonthlyAvg = (data) => {
    if (!data || data.length === 0) return [];
  
    const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const filteredData = data.filter((d) => new Date(d.timestamp) >= lastYear);
  
    const groupedData = groupBy(
      filteredData,
      (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  
    return Object.values(groupedData).map((m) => ({
      month: m.key,
      average: m.total / m.count,
    }));
  };
  
  // Export the functions
  module.exports = { getHourlyAvg, getDailyAvg, getMonthlyAvg };
  