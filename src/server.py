"""The main entrypoint for running the Flask server."""
import sanic
import traceback
import jinja2

app = sanic.Sanic()
app.static('/static', '/app/src/static')

jinja_env = jinja2.Environment(
    loader=jinja2.PackageLoader('src', 'templates'),
    autoescape=jinja2.select_autoescape(['html'])
)


@app.route('/', methods=['GET'])
def root(request):
    return sanic.response.redirect('/dashboard')


@app.route('/iframe/<path:path>', methods=['GET'])
def iframe_content(request, path):
    """Iframe content pages."""
    return _render_template('iframe/index.html')


@app.route('/dashboard', methods=['GET'])
def dashboard(request):
    """Dashboard."""
    return _render_template('dashboard/index.html')


@app.route('/notifications', methods=['GET'])
def notifications(request):
    """Notifications."""
    return _render_template('notifications/index.html')


@app.route('/narratives', methods=['GET'])
def narratives(request):
    """Dashboard."""
    return _render_template('narratives/index.html')


@app.route('/catalog', methods=['GET'])
def catalog(request):
    """Catalog."""
    return _render_template('catalog/index.html')


@app.route('/search', methods=['GET'])
def search(request):
    """Search."""
    return _render_template('search/index.html')


@app.route('/account', methods=['GET'])
def account(request):
    """Account settings."""
    return _render_template('account/index.html')


@app.route('/account/jobs', methods=['GET'])
def jobs(request):
    """Running SDK jobs."""
    return _render_template('account/jobs.html')


@app.route('/orgs', methods=['GET'])
def orgs(request):
    """Organizations."""
    return _render_template('orgs/index.html')


@app.exception(sanic.exceptions.NotFound)
def page_not_found(request, err):
    """404 not found."""
    return (_render_template('404.html'), 404)


@app.exception(Exception)
def server_error(request, err):
    """Any other unhandled exceptions show a 500 error page."""
    print('=' * 80)
    print('500 Unexpected Server Error')
    print('-' * 80)
    traceback.print_exc()
    print('=' * 80)
    return _render_template('500.html', status=500)


def _render_template(path, status=200):
    """
    Render a jinja template and return it as a sanic html response.
    """
    template = jinja_env.get_template(path)
    html = template.render(
        app=app,
    )
    return sanic.response.html(html, status=status)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # nosec
        port=5000,
        workers=8
    )
