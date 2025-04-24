from pymongo import MongoClient

client = MongoClient("mongodb://mongo:27017")
mydb = client["mary_jane"]

def push_store_data_to_db(record):
    ids_collection = mydb["dispo_info"]
    ids_collection.replace_one({'id': record["id"]}, {**record}, upsert=True)

def push_products_to_db(deets):
    ids_collection = mydb["all_products"]
    ids_collection.insert_one({**deets})
    
def drop_db():
    client.drop_database("mary_jane")

def setup_indexes():
    if "stats.store_loc_2dsphere" not in mydb["all_products"].index_information():
        mydb["all_products"].create_index([("stats.store_loc", "2dsphere")])
    if "location.coordinates_2dsphere" not in mydb["dispo_info"].index_information():
        mydb["dispo_info"].create_index([("location.coordinates", "2dsphere")])






