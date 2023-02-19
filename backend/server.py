import numpy as np
import pandas as pd
import pickle
from sklearn.neighbors import NearestNeighbors
from flask import Flask, jsonify, request
import json


app = Flask(__name__)

@app.route('/service', methods=['POST'])
def service():
    data = json.loads(request.data)#
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
    for i in range(len(songs)):
        dis = np.array([dance[i],energy[i],valence[i]]).reshape(1,3)
        if(not songs[i] in goodsongs):
            alt = names[knn2.kneighbors(dis, return_distance=False)[0][0]]
            songs[i]=alt
            alternates[alt]=songs[i]
    out = manylink(songs,n,songtoembed,knn,goodsongs)
    for i in range(len(out)):
        if out[i] in alternates.keys():
            out[i]=alternates[out[i]]
    dic = {'playlist':out}
    if songs is None:
        return jsonify({"message":"text not found"})
    else:
        return jsonify(dic)
def playlist(song1, song2, n,songtoembed, knn, goodsongs):
    emb1 = songtoembed[song1]
    emb2 = songtoembed[song2]
    points = np.array([(x/n)*emb2 +(1-(x/n))*emb1 for x in range(0,n+1)])
    neighbors = knn.kneighbors(points, return_distance=False)
    lis = []
    for arr in neighbors:
        for x in arr:
            if(not x in lis):
                lis.append(x)
                break
    
    return [goodsongs[x] for x in lis]
def manylink(arr, n,songtoembed, knn, goodsongs):
    lis = []
    for x in range(len(arr)-1):
        lis.extend(playlist(arr[x],arr[x+1],n)[:-1],songtoembed, knn, goodsongs)
    if(arr[-1] not in lis):
        lis.append(arr[-1])
    return lis