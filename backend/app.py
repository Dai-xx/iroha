from flask import Flask
from apps.auth import auth as auth_app
from apps.db import db as db_app
import os

# appsディレクトリをPythonのモジュール検索パスに追加

def create_app():
 
    app = Flask(__name__)

    app.secret_key = os.urandom(24)
    
    # 各アプリを登録する
    app.register_blueprint(auth_app.auth, url_prefix="/auth")
    app.register_blueprint(db_app.db, url_prefix="/db")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)