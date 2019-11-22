"""The main entrypoint for running the web server."""
import os
import sanic
import traceback
import jinja2

from src.utils.config import ServerConf

_CONF = ServerConf()

# Initialize the Sanic app object
app = sanic.Sanic('kbase-ui', strict_slashes=False)
app.config.URL_PREFIX = _CONF.url_prefix
app.config.KBASE_ENDPOINT = _CONF.kbase_endpoint
app.config.KBASE_UI_ROOT = _CONF.kbase_root
app.static('/static', _CONF.app_root_path + '/src/static')

# Initialize the Jinja2 templating object
jinja_env = jinja2.Environment(
    loader=jinja2.PackageLoader('src', 'templates'),
    autoescape=jinja2.select_autoescape(['html'])
)


@app.route('/static/build/bundle.js', methods=['GET'])
async def js(req):
    """
    We handle the bundle.js as a special endpoint so we can serve the gzip
    file and set the Content-Encoding header.
    """
    return await sanic.response.file(
        _CONF.app_root_path + '/src/static/build/bundle.js.gz',
        headers={'Content-Encoding': 'gzip', 'Content-Type': 'application/javascript'}
    )


@app.route('/', methods=['GET'])
async def root(request):
    return sanic.response.redirect(_url_for('dashboard'))


@app.route('/dashboard', methods=['GET'])
@app.route('/newnav/dashboard', methods=['GET'])
@app.route('/dashboard/<suffix:path>', methods=['GET'])
@app.route('/newnav/dashboard/<suffix:path>', methods=['GET'])
async def dashboard(request, suffix=None, prefix=None):
    """Dashboard."""
    return _render_template('dashboard/index.html', {'newnav': request.path.startswith('/newnav')})


@app.route('/notifications', methods=['GET'])
@app.route('/notifications/<suffix:path>', methods=['GET'])
async def notifications(request, suffix=None):
    """Notifications."""
    return _render_template('notifications/index.html')


@app.route('/catalog/', methods=['GET'])
@app.route('/catalog/<suffix:path>', methods=['GET'])
async def catalog(request, suffix=None):
    """Catalog."""
    return _render_template('catalog/index.html')


@app.route('/search', methods=['GET'])
@app.route('/search/<suffix:path>', methods=['GET'])
async def search(request, suffix=None):
    """Search."""
    return _render_template('search/index.html')


@app.route('/account', methods=['GET'])
@app.route('/account/<suffix:path>', methods=['GET'])
async def account(request, suffix=None):
    """Account settings."""
    return _render_template('account/index.html')


@app.route('/orgs', methods=['GET'])
@app.route('/orgs/<suffix:path>', methods=['GET'])
async def orgs(request, suffix=None):
    """Organizations."""
    return _render_template('orgs/index.html')


@app.route('/feeds', methods=['GET'])
@app.route('/feeds/<suffix:path>', methods=['GET'])
async def feeds(request, suffix=None):
    """Feeds."""
    # XXX redundant with /notifications
    return _render_template('feeds/index.html')


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
    # Note that _CONF.url_prefix will have leading slash and no trailing slash
    return os.path.join(_CONF.url_prefix, url.strip('/'))


def _render_template(path, args=None, status=200):
    """
    Render a jinja template and return it as a sanic html response.
    Set some default template variables (eg. `app` and `url_for`).
    """
    template = jinja_env.get_template(path)
    if not args:
        args = {}
    args['app'] = app
    args['url_for'] = _url_for
    args.setdefault('newnav', False)
    html = template.render(**args)
    return sanic.response.html(html, status=status)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # nosec
        port=_CONF.server_port,
        workers=_CONF.n_workers,
        access_log=_CONF.development,
        debug=_CONF.development,
        auto_reload=False  # handled by entr in development
    )
