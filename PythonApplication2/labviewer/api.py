import os.path
import json

from flask import request, Response, url_for, send_from_directory
from jsonschema import validate, ValidationError

#from . import decorators
from requests_ntlm import HttpNtlmAuth
import requests
from labviewer import app

auth=HttpNtlmAuth('ads\\yueye','Aug_1234')
@app.route("/api/project/<projectid>")
def get_project(projectid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/projectservice/{}".format(projectid), auth=auth)
    return Response(response.content, 200, mimetype="application/json")

@app.route("/api/projects")
def get_projects():
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/projectservice/?user=ADS\yueye", auth=auth)
    data = response.content.decode("utf-8")
    return Response(data, 200, mimetype="application/json")

@app.route("/api/job/<jobid>")
def jobs(jobid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/jobservice/{}".format(jobid), auth=auth)
    data = response.content.decode("utf-8")
    return Response(data, 200, mimetype="application/json")

@app.route("/api/jobs/projectid=<projectid>&linkid=<linkid>")
def jobsintestcase(projectid=1, linkid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/jobservice/?projectid={}".format(projectid), auth=auth)
    data = response.content.decode("utf-8")
    jobs = json.loads(data)
    jobs = [elem for elem in jobs if elem["LinkID"] == int(linkid)]
    return Response(json.dumps(jobs, sort_keys=True, indent=2, separators=(',', ':')), 200, mimetype="application/json")

@app.route("/api/jobs/projectid=<projectid>")
def jobsinproject(projectid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/jobservice/?projectid={}".format(projectid), auth=auth)
    data = response.content.decode("utf-8")
    return Response(data, 200, mimetype="application/json")
