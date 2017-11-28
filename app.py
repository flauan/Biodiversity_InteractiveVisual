# Data Visualization
# Javascript using Python API with HTML Rendering
# Fervis Lauan       11-27-17

from flask import Flask, render_template, jsonify, redirect
import csv
import json
import sqlite3 as sql
import pandas as pd  


app = Flask(__name__)

@app.route("/")
def index():    
    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select * from samples_metadata")

    component = c.fetchall()
    names=[]
    for row in component:    
        names.append('BB_'+str(row[0]))
    
    return render_template("index.html", ret_names=names)
    

@app.route('/names')
def names():
    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select * from samples_metadata")

    component = c.fetchall()
    names=[]
    for row in component:    
        names.append('BB_'+str(row[0]))
    
    return json.dumps(names)


@app.route('/otu')
def otu():
    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select * from otu")

    component = c.fetchall()
    otu=[]
    for row in component:
        otu.append((row[0],row[1]))    
    otu_df = pd.DataFrame(otu, columns=["otu_id","desc"])
    otu_df.head()  
    otu_df.to_json(orient='records')
    otu_dict=otu_df.to_json(orient='records')    
    return json.dumps(otu_dict)


@app.route('/metadata/<sample>')
def meta(sample):
    sample_id=sample.strip('BB_')
    
    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select * from samples_metadata where sampleid="+sample_id)

    component = c.fetchall()

    samples_meta=[]
    for row in component:    
        samples_meta.append((row[4],row[6],row[2],row[3],row[7],row[0]))    
                        
    samples_df = pd.DataFrame(samples_meta, columns=["Age","BBType","Ethnicity","Gender","Location","SampleID"])    
    meta_dict=samples_df.to_json(orient='records')
    
    return json.dumps(meta_dict)



@app.route('/wfreq/<sample>')
def wfreq(sample):    
    sample_id=sample.strip('BB_')
    
    
    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select wfreq from samples_metadata where sampleid="+sample_id)
    component = c.fetchall()
    samples_wfreq=component[0][0]
    return json.dumps(samples_wfreq)
    


@app.route('/samples/<sample>')
def otu_val(sample):

    con = sql.connect("./Datasets/belly_button_biodiversity.sqlite")
    c = con.cursor()
    c.execute("select otu_id,"+sample+" from samples where "+sample+">0 order by "+sample+" desc")

    component = c.fetchall()

    samples_id=[]
    samples_val=[]    
    for row in component:    
        samples_id.append((row[0]))    
        samples_val.append((row[1]))    

            
    otu_dict = [{'otu_id': samples_id}]
    otu_dict.append([{'otu_val': samples_val}])
    
    return json.dumps(json.dumps(otu_dict))



if __name__ == "__main__":

    app.run(debug=True)