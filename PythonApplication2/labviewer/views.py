from flask import render_template
import json
import requests
from requests_ntlm import HttpNtlmAuth
from flask import request, redirect, url_for, Response
from labviewer import app
from flask import flash

@app.route("/projects")
def entries():
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/projectservice/?user=ADS\yueye", auth=HttpNtlmAuth('ads\\yueye','qaz_123654'))
    data = json.loads(response.content.decode("ascii"))
    return render_template("projects.html", entries = data)

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/project/<projectid>")
def entry(projectid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/projectservice/{}".format(projectid), auth=HttpNtlmAuth('ads\\yueye','qaz_123654'))
    data = json.loads(response.content.decode("ascii"))
    return render_template("project.html", entry = data)

@app.route("/testavalon")
def testpage():
    return render_template("test.html")


