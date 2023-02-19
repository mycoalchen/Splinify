import numpy as np
import pandas as pd
import pickle
from sklearn.neighbors import NearestNeighbors
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json


app = Flask(__name__)
CORS(app, origins=["*", "http://localhost:3000/"])

@app.route('/service', methods=['POST'])
@cross_origin()
def service():
    print("called service")
    data = json.loads(request.data)#
    print(data)
    songs = data['names']
    dance = data['danceability']
    energy = data['energy']
    valence = data['valence']
    n = data['n']
    songtoembed = pickle.load(open('songtoembed.pickle','rb'))
    goodsongs = pickle.load(open('goodsongs.pickle','rb'))
    names = pickle.load(open('names.pickle','rb'))
    knn = pickle.load(open('knn1.pickle','rb'))
    knn2 = pickle.load(open('knn2.pickle','rb'))
    alternates = {}
    print(songs)
    for i in range(len(songs)):
        dis = np.array([dance[i],energy[i],valence[i]]).reshape(1,3)
        if(not songs[i] in goodsongs):
            alt = names[knn2.kneighbors(dis, return_distance=False)[0][0]]
            alternates[alt]=songs[i]
            songs[i]=alt
    out = manylink(songs,n,songtoembed,knn,goodsongs)
    print(out)
    print("WOOOOOO")
    print(alternates)

    for i in range(len(out)):
        if out[i] in alternates.keys():
            out[i]=alternates[out[i]]
    dic = {'playlist':out}
    print(dic)
    return jsonify(dic)
def playlist(song1, song2, n,songtoembed, knn, goodsongs):
    emb1 = songtoembed[song1]
    emb2 = songtoembed[song2]
    points = np.array([(x/n)*emb2 +(1-(x/n))*emb1 for x in range(0,n)])
    neighbors = knn.kneighbors(points, return_distance=False)
    lis = []
    for arr in neighbors:
        for x in arr:
            if(not goodsongs[x] in lis):
                lis.append(goodsongs[x])
                break
    if(not song2 in lis):
        lis.append(song2)
    return lis
def manylink(arr, n,songtoembed, knn, goodsongs):
    lis = []
    for x in range(len(arr)-1):
        meow = playlist(arr[x],arr[x+1],n,songtoembed, knn, goodsongs)
        for r in meow:
            if not r in lis:
                lis.append(r)
    if(arr[-1] not in lis):
        lis.append(arr[-1])
    print(lis)
    return lis