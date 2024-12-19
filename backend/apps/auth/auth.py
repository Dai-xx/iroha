from flask import Blueprint, redirect, url_for, session, request, render_template, jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from google.auth.transport import requests as google_requests
import os

auth = Blueprint("auth", __name__, template_folder="templates", static_folder="satic")

# .envファイルの読み込み
#load_dotenv()

CORS(auth, origins="http://localhost:3000", supports_credentials=True)

# Google OAuth 2.0の設定
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
GOOGLE_CLIENT_ID ="4289035441-sjlg41b0fti1m31e87ke7mak58ot135b.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:5000/auth/callback"


# OAuth 2.0 認証フローを作成
flow = Flow.from_client_secrets_file(
    'client_secret.json',
    scopes=["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    redirect_uri=REDIRECT_URI
)


@auth.route('/')
def index():
    return render_template('index.html')

@auth.route('/login')
def login():
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)

@auth.route('/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session['state'] == request.args['state']:
        return 'State mismatch error', 400

    credentials = flow.credentials
    request_session = google_requests.Request()

    id_info = id_token.verify_oauth2_token(
        credentials.id_token, request_session, GOOGLE_CLIENT_ID
    )

    session['google_id'] = id_info.get("sub")
    session['email'] = id_info.get("email")
    session['name'] = id_info.get("name")
    session['picture'] = id_info.get("picture")

    # return jsonify({
    #         'google_id': session['google_id'],
    #         'email': session['email'],
    #         'name': session['name'],
    #         'picture': session['picture'],
    #     })

    return redirect("http://localhost:3000")

@auth.route('/profile')
def profile():
    if 'google_id' not in session:
        return redirect(url_for('index'))

    user_info = {
        'name': session.get('name'),
        'email': session.get('email'),
        'uid': session.get('google_id'),
        'picture': session.get('picture')
    }

    return render_template('profile.html', user=user_info)

@auth.route('/user_info', methods=['GET'])
def user_info():
    # セッションにユーザー情報が保存されているか確認
    if 'google_id' not in session:
        return jsonify({'error': 'User not authenticated'}), 401

    user_info = {
        'google_id': session['google_id'],
        'email': session['email'],
        'name': session['name'],
        'picture': session['picture']
    }
    return jsonify(user_info)

@auth.route('/logout')
def logout():
    session.clear()
    return redirect('/auth')


