"""The main entrypoint for running the Flask server."""
import os
import sanic
import traceback
import jinja2

# Configure all html routes under a configurable prefix
html_routes = sanic.Blueprint('html_routes', url_prefix=os.environ.get('URL_PREFIX'))
html_routes.static('/static', '/app/src/static', name='static')

jinja_env = jinja2.Environment(
    loader=jinja2.PackageLoader('src', 'templates'),
    autoescape=jinja2.select_autoescape(['html'])
)


@html_routes.route('/', methods=['GET'])
async def root(request):
    return sanic.response.redirect(app.url_for('html_routes.dashboard'))


@html_routes.route('/iframe/<path:path>', methods=['GET'])
async def iframe_content(request, path):
    """Iframe content pages."""
    return _render_template('iframe/index.html')


@html_routes.route('/dashboard', methods=['GET'])
async def dashboard(request):
    """Dashboard."""
    return _render_template('dashboard/index.html')


@html_routes.route('/notifications', methods=['GET'])
async def notifications(request):
    """Notifications."""
    return _render_template('notifications/index.html')


@html_routes.route('/catalog', methods=['GET'])
async def catalog(request):
    """Catalog."""
    return _render_template('catalog/index.html')


@html_routes.route('/search', methods=['GET'])
async def search(request):
    """Search."""
    return _render_template('search/index.html')


@html_routes.route('/account', methods=['GET'])
async def account(request):
    """Account settings."""
    return _render_template('account/index.html')


@html_routes.route('/orgs', methods=['GET'])
async def orgs(request):
    """Organizations."""
    return _render_template('orgs/index.html')


@html_routes.exception(sanic.exceptions.NotFound)
async def page_not_found(request, err):
    """404 not found."""
    print('404 ---')
    print(f'URL: {request.url}')
    print(err)
    return _render_template('404.html', status=404)


@html_routes.exception(Exception)
async def server_error(request, err):
    """Any other unhandled exceptions show a 500 error page."""
    print('=' * 80)
    print('500 Unexpected Server Error')
    print('-' * 80)
    traceback.print_exc()
    print('=' * 80)
    return _render_template('500.html', status=500)


def _render_template(path, args=None, status=200):
    """
    Render a jinja template and return it as a sanic html response.
    """
    template = jinja_env.get_template(path)
    if not args:
        args = {}
    args['app'] = app
    html = template.render(**args)
    return sanic.response.html(html, status=status)


# Initialize the root application
app = sanic.Sanic('kbase-ui', strict_slashes=False)
app.blueprint(html_routes)
app.config.URL_PREFIX = os.environ.get('URL_PREFIX')
app.config.KBASE_ENDPOINT = os.environ.get('KBASE_ENDPOINT', 'https://ci.kbase.us/services')
app.config.KBASE_UI_ROOT = os.environ.get('KBASE_UI_ROOT', 'https://ci.kbase.us')


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # nosec
        port=os.environ.get('SANIC_PORT', 5000),
        workers=os.environ.get('WORKERS', 8),
        access_log=('DEVELOPMENT' in os.environ),
        debug=('DEVELOPMENT' in os.environ)
    )
