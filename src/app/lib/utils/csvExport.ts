export function exportSalesDataToCSV(monthlyRevenue: Array<{
  month: string;
  revenue: number;
  formattedRevenue: string;
}>, totalRevenue: string, todaysRevenue: string, totalOrders: number) {
  // Create CSV content
  const csvContent = [
    // Header
    ['Sales Data Export'],
    [''],
    
    // Summary data
    ['Summary'],
    ['Total Revenue', totalRevenue],
    ['Today\'s Revenue', todaysRevenue],
    ['Total Orders', totalOrders.toString()],
    [''],
    
    // Monthly breakdown
    ['Monthly Revenue Breakdown'],
    ['Month', 'Revenue', 'Formatted Revenue'],
    
    // Monthly data
    ...monthlyRevenue.map(item => [
      new Date(item.month + '-01').toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      item.revenue.toString(),
      item.formattedRevenue
    ]),
    
    // Footer
    [''],
    ['Exported on', new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })]
  ];

  // Convert to CSV string
  const csvString = csvContent
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 