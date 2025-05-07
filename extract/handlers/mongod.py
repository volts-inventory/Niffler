from pymongo import MongoClient

client = MongoClient("mongodb://mongo:27017")
mydb = client["mary_jane"]

def push_store_data_to_db(record):
    ids_collection = mydb["dispo_info"]
    ids_collection.replace_one({'id': record["id"]}, {**record}, upsert=True)

def push_products_to_db(deets):

    product = mydb["all_products"].find_one({"uid": deets["uid"]})
    if product:
        past_prices = product.get("past_prices", [])
        past_prices.append((deets["updated"], product["price"]))
        mydb["all_products"].update_one({"uid": deets["uid"]},
            {
                "$set": {"price": deets["price"], "past_prices": past_prices, "stats.price_per_g": deets["stats"]["price_per_g"], "updated": deets["updated"]}
            })
    else:
        mydb["all_products"].replace_one({"uid": deets["uid"]}, {**deets}, upsert=True)

def setup_indexes():
    if "stats.store_loc_2dsphere" not in mydb["all_products"].index_information():
        mydb["all_products"].create_index([("stats.store_loc", "2dsphere")])
    if "location.coordinates_2dsphere" not in mydb["dispo_info"].index_information():
        mydb["dispo_info"].create_index([("location.coordinates", "2dsphere")])






