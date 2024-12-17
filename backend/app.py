# from flask import Flask, request, jsonify, render_template, send_file, url_for
# from flask_pymongo import PyMongo
# from werkzeug.utils import secure_filename
# from pymongo.mongo_client import MongoClient 
# from pymongo.server_api import ServerApi 
# from datetime import datetime
# from dotenv import load_dotenv
# from bson.objectid import ObjectId
# from flask_cors import CORS
# from pymongo.errors import PyMongoError
# import os
# import io

# app = Flask(__name__)
# CORS(app) 

# load_dotenv()
# try:
#     uri = os.getenv("MONGO_URI")
#     client = MongoClient(uri, server_api=ServerApi(
#         version='1', strict=True, deprecation_errors=True))
#     client.admin.command({'ping': 1})
#     database = client["mydatabase"]
#     #database = client[os.getenv("DB_NAME")]
#     collection_metadata = database["metadata"]
#     collection_content = database["content"]
#     #collection = database[os.getenv("COLLECTION_NAME")]
# except PyMongoError as e:
#     print(f"MongoDB connection error: {e}")

# @app.route('/')
# def index():
#     return render_template('index.html')

#   #POST

# @app.route('/upload', methods=['POST'])

# def upload_file():
#     try:
#         files = request.files
#         project_name = request.form.get('title', 'default_project') 
#         #user_id = request.form.get('user_id', 'anonymous')
#         #tags = request.form.get('tags', 'general').split(',')
#         created_at = datetime.now()

#         metadata_list = []
#         for key in files:
#             file = files[key]
#             filename = secure_filename(file.filename)
#             file_type = file.content_type
#             metadata_list.append({
#                 "filename": filename,
#                 "file_type": file_type}
#             )

#         project_id = collection_metadata.insert_one({
#             #"user_id": user_id,
#             "projectname": project_name,
#             "metadata_list": metadata_list,
#             #"tags": tags,
#             "created_at": created_at
#         }).inserted_id

#         file_list = []
#         for key in files:
#             file = files[key]
#             content = file.read()
#             filename = secure_filename(file.filename)
#             file_type = file.content_type
#             file_list.append({
#                 "project_id": project_id,
#                 "content": content}
#             )

#         document_id = collection_content.insert_many(
#         file_list
#         )

#     except PyMongoError as e:
#             print(f"MongoDB connection error: {e}")  

#     return jsonify({
#         'message': 'ファイルをアップロードしました！', 
#         #'filename': filename,
#         'project_id': str(project_id)
#         }), 200
    
# @app.route('/list/<current_page>', methods=['GET'])
# def list_files(current_page):
#     limit = 14
#     skip = (current_page - 1) * limit

#     metadata_cursor = collection_metadata.find().skip(skip).limit(limit).sort('created_at', 1)
#     metadata_list = []
#     for metadata in metadata_cursor:
#         metadata_list.append({
#             "project_id": str(metadata['_id']),
#             "projectname": metadata['projectname'],
#             "filelist": metadata['filelist'],
#             "created_at": metadata['created_at']
#         })

#     return jsonify(metadata_list), 200

# @app.route('/preview/<project_id>', methods=['GET'])
# def preview_file(project_id):
#     file_data = collection_content.find({"project_id": ObjectId(project_id)})
#     if not file_data:
#         return jsonify({'error': 'File not found'}), 404

#     content = file_data['content']
#     content_type = file_data['content_type']

#     #print(io.BytesIO(content))
#     return send_file(io.BytesIO(content), mimetype=content_type, as_attachment=False, download_name=file_data['filename'])

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify, render_template, send_file, url_for
from pymongo.mongo_client import MongoClient 
from pymongo.server_api import ServerApi 
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo.errors import PyMongoError
from werkzeug.utils import secure_filename
from datetime import datetime
from dotenv import load_dotenv
import base64
import os
import io
import ssl
print(ssl.OPENSSL_VERSION)

app = Flask(__name__)
CORS(app) 

# MongoDBの接続処理
load_dotenv()
#try:
uri = os.environ.get("MONGO_URI")
#uri = "mongodb+srv://taneyukihiro:taym37921103@cluster0.vxk9i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi(
    version='1', strict=True, deprecation_errors=True))
#client.connect()
client.admin.command({'ping': 1})
print("Pinged your deployment. You successfully connected to MongoDB!")
database = client["mydatabase"]
collection_metadata = database["metadata"]
collection_content = database["content"]
# except PyMongoError as e:
#     print(f"MongoDB connection error: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        files = request.files
        project_name = request.form.get('title', 'default_project') 
        created_at = datetime.now()

        # 🛠️ **メタデータのリスト作成**
        metadata_list = []
        for file in files.values():  # すべてのFileStorageオブジェクトを取り出す
            filename = secure_filename(file.filename)
            file_type = file.content_type
            metadata_list.append({
                "filename": filename,
                "file_type": file_type
            })

        project_id = collection_metadata.insert_one({
            "projectname": project_name,
            "metadata_list": metadata_list,
            "created_at": created_at
        }).inserted_id

        # collection_metadata.insert_one({
        #     "projectname": "pro"
        # })

        # 🛠️ **ファイルコンテンツの保存**
        file_list = []
        for file in files.values():  # すべてのFileStorageオブジェクトを取り出す
            content = file.read()
            filename = secure_filename(file.filename)
            file_type = file.content_type
            file_list.append({
                "project_id": project_id,
                "filename": filename,
                "content": content,
                "file_type": file_type,
                "created_at": datetime.now()
            })

        collection_content.insert_many(file_list)

    except PyMongoError as e:
        return jsonify({'error': f"MongoDB error: {e}"}), 500

    return jsonify({
        'message': 'ファイルをアップロードしました！', 
        'project_id': str(project_id)
    }), 200

# @app.route('/list/<int:current_page>', methods=['GET'])
# def list_files(current_page):
#     limit = 14
#     skip = (current_page - 1) * limit

#     metadata_cursor = collection_metadata.find().skip(skip).limit(limit).sort('created_at', 1)
#     JSON_metadata_list = []
#     for metadata in metadata_cursor:
#         JSON_metadata_list.append({
#             "project_id": str(metadata['_id']),
#             "projectname": metadata['projectname'],
#             "created_at": metadata.get['created_at'],
#             "metadata_list": metadata.get('metadata_list', []) # 修正版: filelist → metadata_list
#         })

#     return jsonify(JSON_metadata_list), 200

@app.route('/list/<int:current_page>', methods=['GET'])
def list_files(current_page):
    limit = 14
    skip = (current_page - 1) * limit

    # created_atが存在するドキュメントのみ取得
    metadata_cursor = collection_metadata.find(
        {"created_at": {"$exists": True}},
        {"projectname": 1, "metadata_list": 1, "created_at": 1}
    ).skip(skip).limit(limit).sort('created_at', 1)

    JSON_metadata_list = []
    for metadata in metadata_cursor:
        JSON_metadata_list.append({
            "project_id": str(metadata['_id']),
            "projectname": metadata.get('projectname', 'N/A'),  # projectnameがない場合は 'N/A' を返す
            "metadata_list": metadata.get('metadata_list', []),  # metadata_listがない場合は空のリストを返す
            "created_at": metadata.get('created_at', None)  # created_atがない場合はNoneを返す
        })

    return jsonify(JSON_metadata_list), 200


# @app.route('/preview/<project_id>/<filename>', methods=['GET'])
# def preview_file(project_id, filename):
#     file_data = collection_content.find_one({"project_id": ObjectId(project_id), "filename": filename})
#     if not file_data:
#         return jsonify({'error': 'File not found'}), 404

#     content = file_data['content']
#     content_type = file_data.get('file_type', 'application/octet-stream')

#     return send_file(io.BytesIO(content), mimetype=content_type, as_attachment=False, download_name=file_data['filename'])

@app.route('/preview/<project_id>', methods=['GET'])
def preview_file(project_id):
    try:
        object_id = ObjectId(project_id)           
        #return jsonify({'error': 'Invalid project_id'}), 400

        projectid_list = list(collection_content.find({"project_id": object_id}))
        print(object_id)

        # if not projectid_list:
        #     return jsonify({'error': 'File not found'}), 404

        files_binary = []
        for file_data in projectid_list:
            content_base64 = base64.b64encode(file_data['content']).decode('utf-8')
            files_binary.append({
                "filename": file_data.get('filename', 'unknown_file'),
                "content": content_base64,
                "file_type": file_data.get('file_type', 'application/octet-stream')
            })
        return jsonify({"project_id": project_id, "files": files_binary}), 200

    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
