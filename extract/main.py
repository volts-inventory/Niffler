from datetime import datetime, timezone
from dispo_mappings.request_field_to_common_field_map import disp_field_map_dutch, disp_field_map_jane
import handlers.dispo_handler as dispo_handler
import handlers.mongod as mongod
import time


RANGE = 150
STATES = {
            "MD":(39.0458, -76.6413), 
            "NY":(41.209994, -73.918199),
            "CA":(34.05223, -118.2436)
        }

STATE_CONVERSTION = {"Maryland": "MD", "New York": "NY", "California":"CA"}

def main():
    total_dispos = []

    for state in STATES:
        for dispo_config in [disp_field_map_jane, disp_field_map_dutch]:
            print("Loading dispos")
            dispos = dispo_handler.get_stores(STATES[state][0], STATES[state][1], dispo_config)
            for disp in dispos:
                if disp["location"]["state"] in STATE_CONVERSTION.keys() or disp["location"]["state"] in STATE_CONVERSTION.values():
                    total_dispos.append(disp)
                    store_products = dispo_handler.get_products(disp, dispo_config)
                    [mongod.push_products_to_db(record) for record in store_products]
                    name = disp["store_name"]
                    print(f"Getting {len(store_products)} products for {name}.....")
            [mongod.push_store_data_to_db(dispo_info) for dispo_info in total_dispos]
            print("dispos loaded")


print(f"Firing starting extract....")
main()
mongod.setup_indexes()
while True:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    now_utc = datetime.now(timezone.utc) 
    today = now_utc.date()
    start = datetime(today.year, today.month, today.day, 4, 15, tzinfo=timezone.utc)
    end = datetime(today.year, today.month, today.day, 5, 0, tzinfo=timezone.utc)
    if start <= now_utc <= end:
        print(f"Firing main extract....{timestamp}")
        main()
    print(f"Waiting to fire.....45 min wait...{timestamp}")
    time.sleep(45 * 60)