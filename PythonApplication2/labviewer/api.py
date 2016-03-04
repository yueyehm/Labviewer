import os.path
import json

from flask import request, Response, url_for, send_from_directory
from jsonschema import validate, ValidationError

#from . import decorators
from requests_ntlm import HttpNtlmAuth
import requests
from labviewer import app

@app.route("/api/project/<projectid>")
def get_project(projectid=1):
    response = requests.get("http://10.148.252.129/AutodeskAFWebApp/api/projectservice/{}".format(projectid), auth=HttpNtlmAuth('ads\\yueye','qaz_123654'))
    return Response(response.content, 200, mimetype="application/json")

