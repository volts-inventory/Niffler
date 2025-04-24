let currentPage = 1;
const limit = 25;
let fullResults = [];
let userLat = null;
let userLng = null;

// Hardcoded state coordinates
const stateCoordinates = {
  MD: { lat: 39.0458, lng: -76.6413 },
  NY: { lat: 41.2099, lng: -73.9181 },
  CA: { lat: 34.05223, lng: -118.2436 }
};

// On load
document.addEventListener('DOMContentLoaded', () => {
  fetchUserLocationFromIP().then(() => {
    fetchStores();
    fetchBrands();
    fetchProducts();
  });

  document.getElementById('searchForm').addEventListener('submit', onSearch);
  document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
  document.getElementById('nextPage').addEventListener('click', () => changePage(1));

  document.getElementById('stateSelect').addEventListener('change', (e) => {
    const stateCode = e.target.value;
    if (stateCoordinates[stateCode]) {
      userLat = stateCoordinates[stateCode].lat;
      userLng = stateCoordinates[stateCode].lng;
      fetchStores();
      fetchBrands();
      fetchProducts();
    } else {
      fetchUserLocationFromIP().then(() => {
        fetchStores();
        fetchBrands();
        fetchProducts();
      });
    }
  });
  document.getElementById('max_distance_km').addEventListener('change', () => {
    fetchStores();
    fetchBrands();
    fetchProducts();
  });
});

// Fetch geolocation using IP
async function fetchUserLocationFromIP() {
  try {
    const res = await fetch('https://ipinfo.io/json'); // Replace with your actual token
    const data = await res.json();

    if (data.loc) {
      const [lat, lng] = data.loc.split(',').map(parseFloat);
      userLat = lat;
      userLng = lng;
    }

    if (data.region) {
      const dropdown = document.getElementById('stateSelect');
      const stateCode = data.region.trim().toUpperCase().slice(0, 2);
      if (stateCoordinates[stateCode]) {
        dropdown.value = stateCode;
      }
    }
  } catch (err) {
    console.warn('Could not get IP-based location:', err);
  }
}

// Search submit handler
function onSearch(e) {
  e.preventDefault();
  currentPage = 1;
  fetchProducts();
}

// Pagination
function changePage(direction) {
  const totalPages = Math.ceil(fullResults.length / limit);
  currentPage = Math.min(Math.max(currentPage + direction, 1), totalPages);
  renderPage();
}

// Fetch list of stores (geo only)
async function fetchStores() {
  try {
    const res = await fetch(`/stores?${buildGeoParams().toString()}`);
    const data = await res.json();
    const storeSelect = document.getElementById('store');
    const storeNames = [...new Set(data.map(s => s.store_name).filter(Boolean))].sort();

    storeSelect.innerHTML = '<option value="All" selected>Any Store</option>';
    storeNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      storeSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading stores:', err);
  }
}

// Fetch list of brands (geo only)
async function fetchBrands() {
  try {
    const res = await fetch(`/brands?${buildGeoParams().toString()}`);
    const brands = await res.json();
    const brandSelect = document.getElementById('brand');

    brandSelect.innerHTML = '<option value="All" selected>Any Brand</option>';
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading brands:', err);
  }
}

// Build full query (filters + geo) for products
function buildQueryParams() {
  const params = new URLSearchParams();
  const fields = ['brand', 'type', 'store', 'thc', 'maxPrice'];

  fields.forEach(id => {
    const value = document.getElementById(id)?.value;
    if (value) params.append(id === 'maxPrice' ? 'max_price' : id.toLowerCase(), value);
  });

  const today = new Date().toLocaleDateString('en-CA');
  params.append('date', today);

  if (userLat && userLng) {
    params.append('lat', userLat);
    params.append('lng', userLng);
    params.append('max_distance_km', document.getElementById("max_distance_km")?.value);
  }

  return params;
}

// Geo-only query for brands/stores
function buildGeoParams() {
  const geoParams = new URLSearchParams();
  if (userLat && userLng) {
    geoParams.append('lat', userLat);
    geoParams.append('lng', userLng);
    geoParams.append('max_distance_km', document.getElementById("max_distance_km")?.value);
  }
  return geoParams;
}

// Get query and fetch products
function fetchProducts() {
  const params = buildQueryParams();
  runProductRequest(params);
}

// Fetch and display products
async function runProductRequest(params) {
  const resultsDiv = document.getElementById('results');
  try {
    const res = await fetch(`/products?${params.toString()}`);
    fullResults = await res.json();
    renderPage();
  } catch (err) {
    resultsDiv.innerHTML = '<p>Error fetching products. Check console.</p>';
    console.error(err);
  }
}

// Render paginated results
function renderPage() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const totalPages = Math.ceil(fullResults.length / limit);
  const start = (currentPage - 1) * limit;
  const pageItems = fullResults.slice(start, start + limit);

  if (!pageItems.length) {
    resultsDiv.innerHTML = '<p>No products found matching your filters.</p>';
    document.getElementById('pageInfo').textContent = '';
    return;
  }

  pageItems.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product');
    const fixed_ppg = product.stats?.price_per_g?.toFixed(2) ?? 'N/A';
    const distance_km = product.stats?.distance != null
        ? (product.stats.distance / 1000).toFixed(2)
        : 'N/A';

    div.innerHTML = `
      <img src="${product.image_url || '/static/img/mynameisjeff.png'}" alt="${product.name}" onerror="this.src='/static/img/mynameisjeff.png'" />
      <div class="product-content">
        <a href="${product.stats?.url ?? '#'}" target="_blank">
          <strong>${product.name || 'Unnamed Product'}</strong>
        </a><br/>
        <em>Price per Gram: $${fixed_ppg}</em><br/>
        <em>Price: $${product.price ?? 'N/A'}</em><br/><br/>
        <em>Distance: ${distance_km} km</em><br/><br/>
        Brand: ${product.brand || 'N/A'}<br/>
        THC Percent: ${product.thc_percent ?? 'N/A'}%<br/>
        Dispo: ${product.stats?.store_name || 'N/A'}<br/>
        Weight: ${product.amount_g ?? 'N/A'} g<br/>
        Updated: ${product.created ?? 'N/A'}<br/>
      </div>
    `;
    resultsDiv.appendChild(div);
  });

  document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage <= 1;
  document.getElementById('nextPage').disabled = currentPage >= totalPages;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
