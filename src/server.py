"""The main entrypoint for running the Flask server."""
import flask
import os
from uuid import uuid4
import traceback

app = flask.Flask(__name__, static_folder='static')
app.config['DEBUG'] = os.environ.get('DEVELOPMENT')
app.config['TEMPLATES_AUTO_RELOAD'] = os.environ.get('DEVELOPMENT')
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', str(uuid4()))
app.url_map.strict_slashes = False  # allow both `get /v1/` and `get /v1`


@app.route('/', methods=['GET'])
def root():
    return flask.redirect(flask.url_for('dashboard'))


# iframe content pages
@app.route('/iframe/biochem', methods=['GET'])
def iframe_biochem():
    """Biochemistry search iframe."""
    return flask.render_template('iframe/biochem/index.html')


@app.route('/iframe/dashboard', methods=['GET'])
def iframe_dashboard():
    """Dashboard iframe."""
    return flask.render_template('iframe/dashboard/index.html')


@app.route('/dashboard', methods=['GET'])
def dashboard():
    """Dashboard."""
    return flask.render_template('dashboard/index.html')


@app.route('/notifications', methods=['GET'])
def notifications():
    """Notifications."""
    return flask.render_template('notifications/index.html')


@app.route('/narratives', methods=['GET'])
def narratives():
    """Dashboard."""
    return flask.render_template('narratives/index.html')


@app.route('/catalog', methods=['GET'])
def catalog():
    """Catalog."""
    return flask.render_template('catalog/index.html')


@app.route('/search', methods=['GET'])
def search():
    """Search."""
    return flask.render_template('search/index.html')


@app.route('/account', methods=['GET'])
def account():
    """Account settings."""
    return flask.render_template('account/index.html')


@app.route('/account/jobs', methods=['GET'])
def jobs():
    """Running SDK jobs."""
    return flask.render_template('account/jobs.html')


@app.route('/orgs', methods=['GET'])
def orgs():
    """Organizations."""
    return flask.render_template('orgs/index.html')


@app.errorhandler(404)
def page_not_found(err):
    """404 not found."""
    return (flask.render_template('404.html'), 404)


@app.errorhandler(Exception)
@app.errorhandler(500)
def server_error(err):
    """Any other unhandled exceptions show a 500 error page."""
    print('=' * 80)
    print('500 Unexpected Server Error')
    print('-' * 80)
    traceback.print_exc()
    print('=' * 80)
    return (flask.render_template('500.html'), 500)


@app.after_request
def after_request(response):
    """Actions to perform on the response after the request handler finishes running."""
    print(' '.join([flask.request.method, flask.request.path, '->', response.status]))
    return response
