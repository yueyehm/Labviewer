import os
from flask import Flask
from flask.ext.triangle import Triangle

app = Flask(__name__)
Triangle(app)
config_path = os.environ.get("CONFIG_PATH", "labviewer.config.DevelopmentConfig")
app.config.from_object(config_path)

from . import views
from . import api
#from . import filters
#from . import login