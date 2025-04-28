// ESSKA Web Scraper - Frontend JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const scraperForm = document.getElementById('scraper-form');
  const submitBtn = document.getElementById('submit-btn');
  const loadingElement = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const resultsContainer = document.getElementById('results-container');
  const resultsSummary = document.getElementById('results-summary');
  const resultsList = document.getElementById('results-list');
  const downloadJsonBtn = document.getElementById('download-json');
  const downloadCsvBtn = document.getElementById('download-csv');

  // Store results data
  let scrapedProducts = [];

  // Form submission handler
  scraperForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const url = document.getElementById('url').value;
    const maxProducts = document.getElementById('maxProducts').value;
    const usePlaywright = document.getElementById('usePlaywright').checked;
    
    // Reset UI
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    resultsContainer.classList.add('hidden');
    
    // Show loading
    submitBtn.classList.add('hidden');
    loadingElement.classList.remove('hidden');
    
    try {
      // Call the scraper API
      const response = await fetchScraperResults(url, maxProducts, usePlaywright);
      
      // Process and display results
      scrapedProducts = response.products;
      displayResults(response);
      
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message || 'Failed to scrape website';
      errorMessage.classList.remove('hidden');
    } finally {
      // Hide loading
      submitBtn.classList.remove('hidden');
      loadingElement.classList.add('hidden');
    }
  });

  // Download buttons
  downloadJsonBtn.addEventListener('click', () => {
    if (scrapedProducts.length === 0) return;
    downloadJson(scrapedProducts);
  });
  
  downloadCsvBtn.addEventListener('click', () => {
    if (scrapedProducts.length === 0) return;
    downloadCsv(scrapedProducts);
  });

  // Function to call the scraper API
  async function fetchScraperResults(url, maxProducts, usePlaywright) {
    // In a real implementation, this would call a backend API
    // For this simplified version, we'll use a mock implementation
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if URL is from ESSKA (for demo purposes)
    if (!url.includes('esska.de')) {
      throw new Error('This demo is configured to work with ESSKA website URLs only');
    }
    
    // For demo purposes, return mock data
    // In a real implementation, this would be replaced with actual API call
    return {
      url: url,
      products: [
        {
          url: 'https://www.esska.de/shop/Raeder-und-Rollen/Rollen-Set--28750/Rollen-Set-Kunststoff-Rad-Gummi-Laufflaeche-Kugellager-Rueckenloch-Feststellung--28751',
          title: 'Rollen-Set Kunststoff-Rad, Gummi-Lauffläche, Kugellager, Rückenloch, Feststellung',
          description: 'Rollen-Set bestehend aus 4 Lenkrollen, davon 2 mit Feststellung. Gehäuse aus Stahlblech, verzinkt. Rad aus Polyamid mit Lauffläche aus thermoplastischem Gummi, grau. Kugellager. Rückenloch-Befestigung.'
        },
        {
          url: 'https://www.esska.de/shop/Raeder-und-Rollen/Rollen-Set--28750/Rollen-Set-Kunststoff-Rad-Gummi-Laufflaeche-Kugellager-Platte-Feststellung--28752',
          title: 'Rollen-Set Kunststoff-Rad, Gummi-Lauffläche, Kugellager, Platte, Feststellung',
          description: 'Rollen-Set bestehend aus 4 Lenkrollen, davon 2 mit Feststellung. Gehäuse aus Stahlblech, verzinkt. Rad aus Polyamid mit Lauffläche aus thermoplastischem Gummi, grau. Kugellager. Plattenbefestigung.'
        },
        {
          url: 'https://www.esska.de/shop/Raeder-und-Rollen/Rollen-Set--28750/Rollen-Set-Kunststoff-Rad-Kugellager-Rueckenloch-Feststellung--28753',
          title: 'Rollen-Set Kunststoff-Rad, Kugellager, Rückenloch, Feststellung',
          description: 'Rollen-Set bestehend aus 4 Lenkrollen, davon 2 mit Feststellung. Gehäuse aus Stahlblech, verzinkt. Rad aus Polyamid, weiß. Kugellager. Rückenloch-Befestigung.'
        }
      ]
    };
  }

  // Function to display results
  function displayResults(data) {
    // Update summary
    resultsSummary.textContent = `${data.products.length} Produkte gefunden von ${data.url}`;
    
    // Clear previous results
    resultsList.innerHTML = '';
    
    // Add each product to the list
    data.products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product-item';
      
      productElement.innerHTML = `
        <div class="product-title">${product.title || 'Kein Titel'}</div>
        <div class="product-description">${product.description || 'Keine Beschreibung'}</div>
        <a href="${product.url}" target="_blank" class="product-link">Produkt ansehen</a>
      `;
      
      resultsList.appendChild(productElement);
    });
    
    // Show results container
    resultsContainer.classList.remove('hidden');
  }

  // Function to download JSON
  function downloadJson(products) {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'scraped_products.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Function to download CSV
  function downloadCsv(products) {
    const headers = ['Title', 'Description', 'URL'];
    const csvRows = [
      headers.join(','),
      ...products.map(product => {
        return [
          `"${(product.title || '').replace(/"/g, '""')}"`,
          `"${(product.description || '').replace(/"/g, '""')}"`,
          `"${product.url}"`
        ].join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvString);
    
    const exportFileDefaultName = 'scraped_products.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
});

// Note: This is a simplified frontend-only implementation
// In a real application, you would need a backend server to handle the actual scraping
// For a complete solution, you would need to:
// 1. Set up a simple server (Node.js, Python, etc.)
// 2. Implement the scraping logic on the server
// 3. Create an API endpoint that the frontend can call
// 4. Deploy both frontend and backend to a hosting service
