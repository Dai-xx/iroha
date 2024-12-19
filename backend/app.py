from flask import Flask
from apps.auth import auth as auth_app
from apps.db import db as db_app
import os
from flask_cors import CORS

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
import requests
import hashlib
import base64
import ssl
import os
import io

app = Flask(__name__)
CORS(app) 

# MongoDBの接続処理
load_dotenv()
uri = os.environ.get("MONGO_URI")
#uri = "mongodb+srv://taneyukihiro:taym37921103@cluster0.vxk9i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
VIRUSTOTAL_API_KEY =  os.environ.get("VIRUSTOTAL_API_KEY")
VIRUSTOTAL_FILE_LOOKUP_URL = "https://www.virustotal.com/api/v3"
client = MongoClient(uri, server_api=ServerApi(
    version='1', strict=True, deprecation_errors=True))
client.admin.command({'ping': 1})
print("Pinged your deployment. You successfully connected to MongoDB!")
database = client["mydatabase"]
collection_metadata = database["metadata"]
collection_content = database["content"]

def calculate_file_hash(file, hash_algorithm='sha256'):
    if hash_algorithm == 'sha256':
        hasher = hashlib.sha256()
    elif hash_algorithm == 'md5':
        hasher = hashlib.md5()
    elif hash_algorithm == 'sha1':
        hasher = hashlib.sha1()
    else:
        raise ValueError("Invalid hash algorithm. Choose from 'sha256', 'md5', 'sha1'.")
    #読み取り
    for chunk in iter(lambda: file.read(4096), b""):
        hasher.update(chunk)
    file.seek(0)  # ファイルポインタを先頭に戻す
    print(hasher.hexdigest())
    return hasher.hexdigest()

@app.route('/')
def index():
    return render_template('index.html')

def determine_language(file_type=None, filename=None):
    mine_to_language = {
        'text/x-python': 'Python',
        'text/x-csrc': 'C',
        'text/x-c++src': 'C++',
        'text/javascript': 'JavaScript',
        'application/x-sh': 'Shell Script',
        'text/html': 'HTML',
        'text/css': 'CSS',
        'text/x-java-source': 'Java',
        'text/x-ruby': 'Ruby',
        'application/json': 'JSON',
    }
    if file_type and file_type in mine_to_language:
        return mine_to_language[file_type]
    
    extension_to_language = {
        '.py': 'Python',
        '.c': 'C',
        '.cpp': 'C++',
        '.cc': 'C++',
        '.cxx': 'C++',
        '.hpp': 'C++',
        '.java': 'Java',
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.sh': 'Shell Script',
        '.bash': 'Shell Script',
        '.html': 'HTML',
        '.css': 'CSS',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.rs': 'Rust',
    }

    if filename:
        _, ext = os.path.splitext(filename)
        if ext.lower() in extension_to_language:
            return extension_to_language[ext.lower]

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     try:
#         files = request.files
#         project_name = request.form.get('title', 'default_project') 
#         created_at = datetime.now()

#         # 🛠️ **メタデータのリスト作成**
#         metadata_list = []
#         for file in files.values():  # すべてのFileStorageオブジェクトを取り出す
#             filename = secure_filename(file.filename)
#             file_type = file.content_type
#             language  = determine_language(file.content_type, file.filename)
#             metadata_list.append({
#                 "filename": filename,
#                 "file_type": file_type,
#                 "language": language
#             })

#         project_id = collection_metadata.insert_one({
#             "projectname": project_name,
#             "metadata_list": metadata_list,
#             "created_at": created_at
#         }).inserted_id

#         # 🛠️ **ファイルコンテンツの保存**
#         file_list = []
#         for file in files.values():  # すべてのFileStorageオブジェクトを取り出す
#             scan_result = scan_file_by_hash(file)
#             if 'error' in scan_result:
#                 return jsonify({'error': scan_result['error']}), 400

#             if "data" not in scan_result or "id" not in scan_result["data"]:
#                 return jsonify({'error': 'Invalid scan result from VirusTotal.'}), 500
            
#             analyses_id = scan_result["data"]["id"]
#             print(f"Analysis ID: {analyses_id}")
#             analysis_result = analyses_file(analyses_id)
#             stats = analysis_result.get("data", {}).get("attributes", {}).get("stats", {})
#             malicious_count = stats.get("malicious", 0)

#             if malicious_count > 0:
#                 return jsonify({
#                     'error': '危険なファイルを検出',
#                     'filename': secure_filename(file.filename),
#                     'malicious_count': malicious_count
#                 }), 422
#             content = file.read()
#             filename = secure_filename(file.filename)
#             file_type = file.content_type
#             file_list.append({
#                 "project_id": project_id,
#                 "filename": filename,
#                 "content": content,
#                 "file_type": file_type,
#                 "created_at": datetime.now()
#             })

#         collection_content.insert_many(file_list)

#     except PyMongoError as e:
#         return jsonify({'error': f"MongoDB error: {e}"}), 500

#     return jsonify({
#         'message': 'ファイルをアップロードしました！', 
#         'project_id': str(project_id)
#     }), 201

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        files = request.files
        project_name = request.form.get('title', 'default_project') 
        created_at = datetime.now()

        metadata_list = []
        for file in files.values():
            filename = secure_filename(file.filename)
            file_type = file.content_type
            language = determine_language(file.content_type, file.filename)
            metadata_list.append({
                "filename": filename,
                "file_type": file_type,
                "language": language
            })

        project_id = collection_metadata.insert_one({
            "projectname": project_name,
            "metadata_list": metadata_list,
            "created_at": created_at
        }).inserted_id

        file_list = []
        for file in files.values():
            scan_result = scan_file_by_hash(file)
            if 'error' in scan_result:
                print(f"VirusTotal Scan Error: {scan_result['error']}")
                return jsonify({'error': scan_result['error']}), 400

            if "data" not in scan_result or "id" not in scan_result["data"]:
                print(f"Invalid scan result: {scan_result}")
                return jsonify({'error': 'Invalid scan result from VirusTotal.'}), 500
            
            analyses_id = scan_result["data"]["id"]
            print(f"Analysis ID: {analyses_id}")
            analysis_result = analyses_file(analyses_id)  # 🚀 ここでanalyses_fileを呼び出す

            # 🔍 **デバッグ出力追加**
            print(f"Analysis Result: {analysis_result}")  

            if 'error' in analysis_result:
                print(f"Analysis Error: {analysis_result['error']}")
                return jsonify({'error': analysis_result['error']}), 400
            
            stats = analysis_result.get("data", {}).get("attributes", {}).get("stats", {})
            malicious_count = stats.get("malicious", 0)
            
            if malicious_count > 0:
                return jsonify({
                    'error': '危険なファイルを検出',
                    'filename': secure_filename(file.filename),
                    'malicious_count': malicious_count
                }), 422
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
    }), 201

    
def scan_file_by_hash(file):
    try:
        if file.filename == '':
            return {'error': 'ファイルが選ばれていません'}

        headers = {'x-apikey': VIRUSTOTAL_API_KEY}
        files_payload = {'file': (file.filename, file.stream, file.content_type)}  # 正しい形式でファイルをアップロード

        response = requests.post(f"{VIRUSTOTAL_FILE_LOOKUP_URL}/files", headers=headers, files=files_payload)

        # 成功時の処理
        if response.status_code == 200:
            try:
                scan_result = response.json()
                print(f"Scan Result: {scan_result}")  # デバッグ用の出力
                return scan_result
            except Exception as e:
                print(f"Failed to parse JSON: {response.text}")
                return {'error': f"Failed to parse JSON response: {str(e)}"}
        
        # ファイルが存在しない場合の処理
        elif response.status_code == 404:
            return {'error': 'アップロードが正常に行われませんでした'}
        
        # その他の不明なエラー
        else:
            try:
                return {'error': f"Unexpected API response: {response.status_code}", 'details': response.json()}
            except Exception as e:
                print(f"Unexpected API Response: {response.text}")
                return {'error': f"Unexpected API response: {response.status_code}", 'details': response.text}

    except Exception as e:
        return {'error': f"An error occurred during VirusTotal hash lookup: {str(e)}"}
    
def analyses_file(analyses_id):
    try:
        headers = {'x-apikey': VIRUSTOTAL_API_KEY}
        while True:
            # クエリ送信
            response = requests.get(f"{VIRUSTOTAL_FILE_LOOKUP_URL}/analyses/{analyses_id}", headers=headers)
            if response.status_code == 200:
                try:
                    scan_result = response.json()
                    status = scan_result.get('data', {}).get('attributes', {}).get('status')
                    if status == 'completed':
                        print(f"Analysis completed: {scan_result}")  # デバッグ用出力
                        return scan_result  # 🚀 修正版: **return jsonify(scan_result)をreturn scan_resultに変更**
                    else:
                        print(f"Scan status: {status}")
                        return {'error': f'Scan status: {status}'}
                except Exception as e:
                    print(f"Failed to parse JSON: {response.text}")
                    return {'error': f"Failed to parse JSON response: {str(e)}"}
            elif response.status_code == 404:
                return {'error': 'analysesが見つかりませんでした'}
            else:
                try:
                    print(f"Unexpected API Response: {response.json()}")
                    return {'error': f"Failed to retrieve analysis results from VirusTotal", 'details': response.json()}
                except Exception as e:
                    print(f"Unexpected API Response (not JSON): {response.text}")
                    return {'error': f"Failed to retrieve analysis results from VirusTotal", 'details': response.text}

    except Exception as e:
        return {'error': f'An error occurred: {str(e)}'}


@app.route('/list/<int:current_page>', methods=['GET'])
def list_files(current_page):
    limit = 14
    skip = (current_page - 1) * limit

    # created_atが存在するドキュメントのみ取得
    metadata_cursor = collection_metadata.find(
        {"created_at": {"$exists": True}},
        {"projectname": 1, "metadata_list": 1, "created_at": 1}
    ).skip(skip).limit(limit).sort('created_at', -1)

    JSON_metadata_list = []
    for metadata in metadata_cursor:
        JSON_metadata_list.append({
            "project_id": str(metadata['_id']),
            "projectname": metadata.get('projectname', 'N/A'),  # projectnameがない場合は 'N/A' を返す
            "metadata_list": metadata.get('metadata_list', []),  # metadata_listがない場合は空のリストを返す
            "created_at": metadata.get('created_at', None)  # created_atがない場合はNoneを返す
        })

    return jsonify(JSON_metadata_list), 200


@app.route('/preview/<project_id>', methods=['GET'])
def preview_file(project_id):
    try:
        object_id = ObjectId(project_id)           
        #return jsonify({'error': 'Invalid project_id'}), 400

        projectid_list = list(collection_content.find({"project_id": object_id}))
        print(object_id)

        # if not projectid_list:
        #     return jsonify({'error': 'File not found'}), 404
        

# appsディレクトリをPythonのモジュール検索パスに追加

def create_app():
 
    app = Flask(__name__)

    CORS(app)

    app.secret_key = os.urandom(24)
    
    # 各アプリを登録する
    app.register_blueprint(auth_app.auth, url_prefix="/auth")
    app.register_blueprint(db_app.db, url_prefix="/db")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)