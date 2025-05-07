from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb://mongo:27017")
mydb = client["mary_jane"]

@app.route('/stores')
def get_stores():
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))
    max_distance_km = float(request.args.get("max_distance_km", 80)) * 1000
    query = {"location.coordinates":{"$nearSphere": {"$geometry": {"type": "Point","coordinates": [lng, lat]}, "$maxDistance":max_distance_km}}}
    print(query)
    return jsonify(list(mydb["dispo_info"].find(query, {'_id': False})))

@app.route('/brands')
def get_brands():
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))
    max_distance_km = float(request.args.get("max_distance_km", 80)) * 1000
    s = sorted([x for x in mydb["all_products"].distinct("brand",{"brand":{ "$ne" : None }, "stats.store_loc":{"$nearSphere": {"$geometry": {"type": "Point","coordinates": [lng, lat]}, "$maxDistance":max_distance_km}}})])
    return jsonify(s)

@app.route('/products')
def get_products():
    brand = request.args.get('brand')
    type = request.args.get('type')
    date = request.args.get('date')
    store = request.args.get('store')
    thc = float(request.args.get('thc'))
    max_price = float(request.args.get("max_price"))
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))
    max_distance_km = int(request.args.get("max_distance_km", 80)) * 1000
    
    if brand and type and date:
        meep_filters = {
            "price": {"$lte": max_price},
            "thc_percent": {"$gt": thc},
            "updated": {"$regex": date}
        }   

        if brand != "All":
            meep_filters["brand"] = brand
        if type != "All":
            meep_filters["type"] = type
        if store != "All":
            meep_filters["stats.store_name"] = store

        pipeline = [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "distanceField": "stats.distance",  # This is where the computed distance goes
                    "maxDistance": max_distance_km,  # convert km to meters
                    "spherical": True,
                    "key": "stats.store_loc"
                }
            },
            {
                "$match": meep_filters,
                
            },
            { 
                "$sort": { "stats.price_per_g": 1 } 
            },
            {
                "$project": {
                    "_id": 0
                }
            },
            {
                "$limit": 250
            }
        ]
        try:
            print(pipeline)
            payload = list(mydb["all_products"].aggregate(pipeline))
            return jsonify(payload)
        except Exception as e:
            print(e)
            return jsonify([500,''])
    else:
        return jsonify([404, 'missing ness params in url'])