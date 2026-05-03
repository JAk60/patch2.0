import os
from flask import Flask, request
from flask_apscheduler import APScheduler
from flask_mail import Mail
from flask_talisman import Talisman
from waitress import serve
from API.extensions import mail, scheduler  

from API.auth import auth_bp
from API.system import system_bp
from API.reliability import reliability_bp
from API.condition_monitoring import cm_bp
from API.rcm import rcm_bp
from API.data_manager import data_manager_bp
from API.rul import rul_bp
from API.tasks import tasks_bp
from API.etl import etl_bp
from API.files import files_bp
from API.dashboard import dashboard_bp
from API.misc import misc_bp

CSP = {
    'default-src': "'self'",
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'"],
    'manifest-src': "'self'",
    'media-src': "'self'",
    'frame-src': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': ["'self'"],
    'frame-ancestors': "'none'",
}


def create_app():
    app = Flask(__name__, static_folder='./frontend/build', static_url_path='')
    
    app.secret_key = 'your-fixed-secret-key'
    app.config['SCHEDULER_API_ENABLED'] = True
    app.config['MAIL_SERVER'] = 'smtp.ethereal.email'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = 'favian.jacobs@ethereal.email'
    app.config['MAIL_PASSWORD'] = 'bstZAfTvzfUHs56uva'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['UPLOAD_FOLDER'] = 'uploads'
    
    mail.init_app(app)
    scheduler.init_app(app)
    Talisman(
        app,
        content_security_policy=CSP,
        force_https=False,
        force_https_permanent=False,
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        frame_options='DENY',
        x_content_type_options=True,
        x_xss_protection=True,
        referrer_policy='strict-origin-when-cross-origin',
        session_cookie_secure=False,
        session_cookie_samesite='Lax',
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(reliability_bp)
    app.register_blueprint(cm_bp)
    app.register_blueprint(rcm_bp)
    app.register_blueprint(data_manager_bp)
    app.register_blueprint(rul_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(etl_bp)
    app.register_blueprint(files_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(misc_bp)

    _register_hooks(app)

    _register_jobs(app)
    return app


def _register_hooks(app):
    BLOCKED_PATHS = ['/.git', '/.env', '/.DS_Store', '/.htaccess',
                     '/web.config', '/.vscode', '/package.json']

    @app.before_request
    def block_sensitive_files():
        if any(p in request.path.lower() for p in BLOCKED_PATHS):
            from flask import abort
            abort(404)

    @app.before_request
    def log_request():
        print(f"[REQ] {request.method} {request.path} (endpoint={request.endpoint})")

    @app.after_request
    def apply_security_headers(response):
        import re
        for h in ['Last-Modified', 'ETag', 'Date', 'Server', 'X-Powered-By', 'Age', 'Content-Disposition']:
            response.headers.pop(h, None)

        response.headers.setdefault('X-Content-Type-Options', 'nosniff')
        response.headers.setdefault('X-Frame-Options', 'DENY')
        response.headers.setdefault('X-XSS-Protection', '1; mode=block')
        response.headers.setdefault('Referrer-Policy', 'strict-origin-when-cross-origin')
        response.headers.setdefault('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

        path = request.path.lower()
        static_exts = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg',
                       '.woff', '.woff2', '.ttf', '.eot']

        if any(path.endswith(e) for e in static_exts) or '/assets/' in path or '/static/' in path:
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        else:
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'

        if response.content_type in ['application/xml', 'text/xml', 'application/zip']:
            content = response.get_data(as_text=True)
            content = re.sub(r'<\?xml[^?>]*\?>', '', content)
            content = re.sub(r'created="[^"]*"', 'created=""', content)
            content = re.sub(r'timestamp="[^"]*"', 'timestamp=""', content)
            content = re.sub(r'datetime="[^"]*"', 'datetime=""', content)
            response.set_data(content)

        return response

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        import mimetypes
        if path.startswith('api/'):
            return {'error': 'API endpoint not found'}, 404

        if path and os.path.exists(os.path.join(app.static_folder, path)):
            file_path = os.path.join(app.static_folder, path)
            if os.path.isfile(file_path):
                with open(file_path, 'rb') as f:
                    file_data = f.read()
                mimetype = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'
                response = app.response_class(file_data, mimetype=mimetype)
                if path.startswith('assets/'):
                    response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
                else:
                    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                return response

        index_path = os.path.join(app.static_folder, 'index.html')
        with open(index_path, 'rb') as f:
            index_data = f.read()
        response = app.response_class(index_data, mimetype='text/html')
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response


def _register_jobs(app):
    @scheduler.task('interval', id='hit_srcetl', days=5, misfire_grace_time=10)
    def scheduled_etl():
        import requests as req
        try:
            resp = req.get("http://127.0.0.1:5000/api/srcetl")
            print(f"[Scheduler] ETL response: {resp.text}")
        except Exception as e:
            print(f"[Scheduler] ETL failed: {e}")


if __name__ == "__main__":
    app = create_app()
    app.secret_key = os.environ.get("SECRET_KEY", os.urandom(32))
    app.wsgi_app = __import__('middleware').TaskMiddleWare(app.wsgi_app, os.path.dirname(os.path.abspath(__file__)))
    scheduler.start()
    serve(app, host="0.0.0.0", port=5000, ident=None, expose_tracebacks=False)
