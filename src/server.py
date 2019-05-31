"""The main entrypoint for running the Flask server."""
import os
import sanic
import traceback
import jinja2

# Initialize the Sanic app object
app = sanic.Sanic('kbase-ui', strict_slashes=False)
app.config.URL_PREFIX = os.environ.get('URL_PREFIX', '').rstrip('/')
app.config.KBASE_ENDPOINT = os.environ.get('KBASE_ENDPOINT', 'https://ci.kbase.us/services')
app.config.KBASE_UI_ROOT = os.environ.get('KBASE_UI_ROOT', 'https://ci.kbase.us')
app.static('/static', '/app/src/static')

# Initialize the Jinja2 templating object
jinja_env = jinja2.Environment(
    loader=jinja2.PackageLoader('src', 'templates'),
    autoescape=jinja2.select_autoescape(['html'])
)


@app.route('/', methods=['GET'])
async def root(request):
    return sanic.response.redirect(_url_for('dashboard'))


@app.route('/iframe/<path:path>', methods=['GET'])
async def iframe_content(request, path):
    """Iframe content pages."""
    return _render_template('iframe/index.html', request)


@app.route('/dashboard', methods=['GET'])
async def dashboard(request):
    """Dashboard."""
    return _render_template('dashboard/index.html', request)


@app.route('/notifications', methods=['GET'])
async def notifications(request):
    """Notifications."""
    return _render_template('notifications/index.html', request)


@app.route('/catalog', methods=['GET'])
async def catalog(request):
    """Catalog."""
    return _render_template('catalog/index.html', request)


@app.route('/search', methods=['GET'])
async def search(request):
    """Search."""
    return _render_template('search/index.html', request)


@app.route('/account', methods=['GET'])
async def account(request):
    """Account settings."""
    return _render_template('account/index.html', request)


@app.route('/orgs', methods=['GET'])
async def orgs(request):
    """Organizations."""
    return _render_template('orgs/index.html', request)


@app.exception(sanic.exceptions.NotFound)
async def page_not_found(request, err):
    """404 not found."""
    print('404:', request.path)
    return _render_template('404.html', status=404)


@app.exception(Exception)
async def server_error(request, err):
    """Any other unhandled exceptions show a 500 error page."""
    print('=' * 80)
    print('500 Unexpected Server Error')
    print('-' * 80)
    traceback.print_exc()
    print('=' * 80)
    return _render_template('500.html', status=500)


def _url_for(arg, *args, **kwargs):
    """
    A wrapper around app.url_for that injects a configurable prefix.
    For example, if we are serving via nginx proxy at /services/react-ui
    then we want our links to look like "/services/react-ui/{link_path}"
    """
    url = app.url_for(arg, *args, **kwargs)
    # Note that app.config.URL_PREFIX will have leading slash and no trailing slash
    return os.path.join(app.config.URL_PREFIX, url.strip('/'))


def _render_template(path, args=None, status=200):
    """
    Render a jinja template and return it as a sanic html response.
    """
    template = jinja_env.get_template(path)
    if not args:
        args = {}
    args['app'] = app
    args['url_for'] = _url_for
    html = template.render(**args)
    return sanic.response.html(html, status=status)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # nosec
        port=os.environ.get('SANIC_PORT', 5000),
        workers=os.environ.get('WORKERS', 8),
        access_log=('DEVELOPMENT' in os.environ),
        debug=('DEVELOPMENT' in os.environ)
    )
