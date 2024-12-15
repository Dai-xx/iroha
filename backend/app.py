from flask import Flask, request, jsonify, render_template, send_file, url_for
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename
from pymongo.mongo_client import MongoClient 
from pymongo.server_api import ServerApi 
from datetime import datetime
from dotenv import load_dotenv
from bson.objectid import ObjectId
from flask_cors import CORS
import os
import io

app = Flask(__name__)
CORS(app) 

load_dotenv()

uri = os.getenv("MONGO_URI")
client = MongoClient(uri)
database = client["mydatabase"]
#database = client[os.getenv("DB_NAME")]
collection_metadata = database["metadata"]
collection_content = database["content"]
#collection = database[os.getenv("COLLECTION_NAME")]

@app.route('/')
def index():
    return render_template('index.html')

  #POST

@app.route('/upload', methods=['POST'])
def upload_file():
    index = 0
    files = request.files
    for key in files:
            file = files[key]
            content = file.read()
    project_name = request.form.get('projectname', 'default_project') 
    filename = secure_filename(file.filename)
    file_type = file.content_type
    #user_id = request.form.get('user_id', 'anonymous')
    #tags = request.form.get('tags', 'general').split(',')
    created_at = datetime.now()

    project_id = collection_metadata.insert_one({
        #"user_id": user_id,
        "projectname": project_name,
        "meta_list": [{
        "filename": filename,
        "file_type": file_type,
        },
        {
        "filename": filename,
        "file_type": file_type,
        }],
        #"tags": tags,
        "created_at": created_at
    }).inserted_id

    file_list = []
    for file in enumerate(files):
        filename = secure_filename(file.filename)
        file_type = file.content_type
        file_list.append({
            "project_id": project_id,
            "content": content}
        )
        index += 1

    document_id = collection_content.insert_many({
       file_list
    })

    return jsonify({
        'message': 'ファイルをアップロードしました！', 
        'filename': filename,
        'project_id': str(project_id)
        }), 200

@app.route('/list/<current_page>', methods=['GET'])
def list_files(current_page):
    limit = 14
    skip = (current_page - 1) * limit

    metadata_cursor = collection_metadata.find().skip(skip).limit(limit).sort('created_at', 1)
    metadata_list = []
    for metadata in metadata_cursor:
        metadata_list.append({
            "project_id": str(metadata['_id']),
            "projectname": metadata['projectname'],
            "filelist": metadata['filelist'],
            "created_at": metadata['created_at']
        })

    return jsonify(metadata_list), 200

@app.route('/preview/<project_id>', methods=['GET'])
def preview_file(project_id):
    file_data = collection_content.find({"project_id": ObjectId(project_id)})
    if not file_data:
        return jsonify({'error': 'File not found'}), 404

    content = file_data['content']
    content_type = file_data['content_type']

    #print(io.BytesIO(content))
    return send_file(io.BytesIO(content), mimetype=content_type, as_attachment=False, download_name=file_data['filename'])

if __name__ == '__main__':
    app.run(debug=True)
