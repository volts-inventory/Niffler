disp_field_map_dutch = {
    "store_name":"name",
    "id":"id",
    "cname":"cName",
    "coordinates_lat":"location.geometry.coordinates",
    "coordinates_lng":"location.geometry.coordinates",
    "flip": "merp",
    "state":"location.state",
    "url_base": "https://dutchie.com/dispensary/",
    "query_url": f"https://dutchie.com/graphql?operationName=DispensarySearch&variables=%7B%22dispensaryFilter%22%3A%7B%22medical%22%3Afalse%2C%22recreational%22%3Afalse%2C%22sortBy%22%3A%22distance%22%2C%22activeOnly%22%3Atrue%2C%22city%22%3A%22Apache%20Junction%22%2C%22country%22%3A%22United%20States%22%2C%22nearLat%22%3Aå%2C%22nearLng%22%3A∫%2C%22distance%22%3Aç%2C%22openNowForPickup%22%3Afalse%2C%22acceptsCreditCardsPickup%22%3Afalse%2C%22acceptsDutchiePay%22%3Afalse%2C%22offerCurbsidePickup%22%3Afalse%2C%22offerPickup%22%3Atrue%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22c15335c61b3aa861f8959251f17b6ba5f0a1d5f1d2bdd4c0d691b6bae6f3ceb3%22%7D%7D",
    "additional_headers":  {
        "accept": "*/*'",
        "apollographql-client-name": "Marketplace (production)"
    },
    "main_key": "data.filteredDispensaries",
    "product_types": {"Flower": "Flower","Concentrate": "Concentrate","Edible": "Edible","Pre-Rolls": "Pre-Rolls","Vaporizers": "Vaporizers"},
    "product_url": "https://dutchie.com/api-4/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%22å%22%2C%22pricingType%22%3A%22rec%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%22%2C%22%2C%22∫%22%5D%2C%22useCache%22%3Atrue%2C%22isDefaultSort%22%3Atrue%2C%22sortBy%22%3A%22popularSortIdx%22%2C%22sortDirection%22%3A1%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%224bfbf7d757b39f1bed921eab15fc7328dab55a30ad47ff8d5cc499f810ff2aee%22%7D%7D",
    "add_product_headers": {
        'accept': '*/*',
        'apollographql-client-name': 'Marketplace (production)',
        'content-type': 'application/json'
    },
   "product_return_key": "data.filteredProducts.products",
   "search_range": 20,
   "product_info_map":{
       "ID": "id",
       "Name": "Name",
       "Brand": "brandName",
       "Type":"type",
       "Weight": "measurements.netWeight.values.0",
       "Price": "recSpecialPrices.0",
       "Price_alt": "recPrices.0",
       "THC": "THCContent.range.0",
       "URL_for": "å/product/∫",
       "Photo": "Image",
       "Url_slug": "cName",
       "Store_url": "cName"
   }
}

disp_field_map_jane = {
    "store_name":"name",
    "id":"id",
    "cname":"id",
    "coordinates_lat":"lat",
    "coordinates_lng":"long",
    "state":"state",
    "url_base": "https://www.iheartjane.com/stores/",
    "query_url": f"https://www.iheartjane.com/api/v1/home_stores?lat=å&long=∫&distance=ç",
    "additional_headers" : {},
    "main_key": "stores",
    "product_types": {"flower": "Flower","extract": "Concentrate","edible": "Edible","pre-roll": "Pre-Rolls","vape": "Vaporizers"},
    "product_url": "https://search.iheartjane.com/1/indexes/menu-products-production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.2)%3B%20Browser%3B%20JS%20Helper%20(3.11.1)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.36.0)",
    "add_product_headers": {
        'accept': '*/*' , 
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://www.iheartjane.com',
        'referer': 'https://www.iheartjane.com/'
    },
   "product_query_raw":{
        "query": "",
        "filters": "",
        "facets": ["*"],
        "hitsPerPage": 1000
    }, 
    "product_filter_string": 'store_id = å AND (kind:\"∫\" OR root_types:\"∫\")',
    "product_return_key": "hits",
    "search_range": 10,
    "product_info_map":{
       "ID": "product_id",
       "Name": "name",
       "Brand": "brand",
       "Type":"kind",
       "Weight": "available_weights.0",
       "Price": "sort_price",
       "Price_alt": "sort_price",
       "THC": "percent_thc",
       "URL_for": "å/menu/products/∫/ç",
       "Photo": "product_photos.1.urls.medium",
       "Photo_alt": "product_photos.0.urls.medium",
       "Url_slug": "url_slug",
       "Store_url": "id"
   }
}
