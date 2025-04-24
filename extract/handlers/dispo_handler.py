from curl_cffi import requests
import time
import json
from datetime import datetime, timezone

def get_by_path(data, path, sep="."):
    for key in path.split(sep):
        try:
            if isinstance(data, dict):
                data = data[key]
            elif isinstance(data, list) and key.isdigit():
                data = data[int(key)]
        except Exception as e:
            #print(f"Invalid path: {path} for data: {data}")
            data = None
    return data

def get_stores(lat, long, disp_field_map):
    misconfig_store_names = ["Peake ReLeaf"]
    black_list_names = ["GOLDLEAF"]
    dispos, resp, stores = [], [], []
    dist = disp_field_map["search_range"]
    url = disp_field_map["query_url"].replace("å", str(lat)).replace("∫", str(long)).replace("ç", str(dist))
    headers = {
        "content-type": "application/json",
        "Accept": "application/json"
    }
    headers.update(disp_field_map["additional_headers"])
    retry = 3

    while retry:
        try: 
            resp = requests.get(url, headers=headers, impersonate="chrome110").json()
            stores = get_by_path(resp, disp_field_map["main_key"])
            retry = 0
        except Exception as e:
            print(e)
            print(f"Timing throttle.....{retry}......stores")
            time.sleep(10)
            retry -= 1
            if not retry:
                print("Failed stores")

    for store in stores:
        name = get_by_path(store, disp_field_map["store_name"])
        if ((not "med" in name.lower() and not "medic" in name.lower() and not "delivery" in name.lower()) or name in misconfig_store_names) and name[:8] not in black_list_names:
            _id = get_by_path(store, disp_field_map["id"])
            url = disp_field_map["url_base"]+str(get_by_path(store, disp_field_map["cname"]))
            state = get_by_path(store, disp_field_map["state"])

            if "flip" in disp_field_map:
                coords = (round(float(get_by_path(store, disp_field_map["coordinates_lng"])[0]), 4), round(float(get_by_path(store, disp_field_map["coordinates_lat"])[1]), 4))
            else:
                coords = (round(float(get_by_path(store, disp_field_map["coordinates_lng"])), 4), round(float(get_by_path(store, disp_field_map["coordinates_lat"])), 4))
            
            dispos.append({
                            "store_name": name, 
                            "cName": get_by_path(store, disp_field_map["cname"]),
                            "id":_id,
                            "url":url,
                            "location": {
                                "coordinates": coords, 
                                "state": state
                                }, 
                            })
    return dispos
            

def get_products(store, disp_field_map):
    result = []
    store_products = []
    product_types = disp_field_map["product_types"]
    for _type in product_types.keys():
        retry = 3   
        headers = {
            "content-type": "application/json",
            "Accept": "application/json"
        }
        headers.update(disp_field_map["add_product_headers"])    
        while retry:
            try:
                if "product_query_raw" in disp_field_map:
                    filter = disp_field_map["product_filter_string"].replace("å", str(store["id"])).replace("∫", _type)
                    prep = disp_field_map["product_query_raw"]
                    prep["filters"] = filter
                    payload_json = json.dumps(prep)
                    resp = requests.post(disp_field_map["product_url"], data=payload_json, headers=headers, impersonate="chrome110").json()
                else:
                    url = disp_field_map["product_url"].replace("å", str(store["id"])).replace("∫", str(_type))
                    resp = requests.get(url, headers=headers, impersonate="chrome110").json()
                result += get_by_path(resp, disp_field_map["product_return_key"])
                retry = 0
            except Exception as e:
                print(f"Timing throttle....product.....{retry}.....{store['store_name']}")
                retry -= 1
                if not retry:
                    print("Failed product")
                time.sleep(1)
    for product in result:
        try:
            a = {"gram": 1, "eighth ounce": 3.5, "quarter ounce": 7, "half ounce": 14, "two gram": 2, "ounce": 28, "price each": 1, "half gram":0.5}
            convert = {"flower": "Flower","extract": "Concentrate","edible": "Edible","pre-roll": "Pre-Rolls","vape": "Vaporizers"}

            _type = get_by_path(product, disp_field_map["product_info_map"]["Type"])
            if _type in convert.keys():
                _type = convert[_type]

            # https://www.iheartjane.com/stores/4439
            # https://www.iheartjane.com/stores/4439/products/the-essence-ice-cream-cake-1g
            # https://dutchie.com/dispensary/harvest-of-rockville/product/0-75g-afternoon-delight-4-big-dog-pre-roll
            if "ç" in disp_field_map["product_info_map"]["URL_for"]:
                url = disp_field_map["url_base"] + disp_field_map["product_info_map"]["URL_for"].replace("å", str(get_by_path(store, disp_field_map["product_info_map"]["Store_url"]))).replace("∫", str(get_by_path(product, disp_field_map["product_info_map"]["ID"]))).replace("ç", str(get_by_path(product, disp_field_map["product_info_map"]["Url_slug"])))
            else:
                url = disp_field_map["url_base"] + disp_field_map["product_info_map"]["URL_for"].replace("å", str(get_by_path(store, disp_field_map["product_info_map"]["Store_url"]))).replace("∫", str(get_by_path(product, disp_field_map["product_info_map"]["Url_slug"])))
            
            if get_by_path(product, disp_field_map["product_info_map"]["Weight"]) in a.keys():
                weight = a[get_by_path(product, disp_field_map["product_info_map"]["Weight"])]
            else:
                weight = get_by_path(product, disp_field_map["product_info_map"]["Weight"])
                if not weight:
                    weight = 1000
                weight = weight/1000

            img_url = get_by_path(product, disp_field_map["product_info_map"]["Photo"])
            if not img_url:
                img_url = get_by_path(product, disp_field_map["product_info_map"]["Photo_alt"])
            if not img_url:
                img_url= "https://directus-media.leafly.com/92c0791b-1605-42d5-a9b2-e484bba88da1.png?auto=compress%2Cformat&w=80&dpr=2"
            
            if not weight:
                weight = 1
            price = get_by_path(product, disp_field_map["product_info_map"]["Price"])
            if not price:
                price = get_by_path(product, disp_field_map["product_info_map"]["Price_alt"])
            if price > 1:
                thc_check = get_by_path(product, disp_field_map["product_info_map"]["THC"])
                thc = thc_check if thc_check else 1

                record = {
                        "name":get_by_path(product, disp_field_map["product_info_map"]["Name"]),
                        "brand": get_by_path(product, disp_field_map["product_info_map"]["Brand"]),
                        "type":_type,
                        "amount_g":weight,
                        "price": price,
                        "thc_percent":thc,
                        "created": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                        "image_url": img_url,
                        "stats":{
                            "price_per_g": round(float(price/weight), 2),
                            "url": url,
                            "store_name":store["store_name"], 
                            "store_id":store["id"],
                            "state": store["location"]["state"],
                            "store_loc":store["location"]["coordinates"], 
                            "id": get_by_path(product, disp_field_map["product_info_map"]["ID"])
                        }
                    }
                store_products.append(record)
        except Exception as e:
            print(e)
            pass
    return store_products