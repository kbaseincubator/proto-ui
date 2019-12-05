"""
Load server configuration from the environment.
"""
import os


class ServerConf:
    """
    Usage:
        conf = ServerConf()
        # Reload with:
        conf.load_conf()
    """

    def __init__(self):
        self.load_conf()

    def load_conf(self):
        self.app_root_path = '/app'
        self.development = 'DEVELOPMENT' in os.environ
        self.server_port = os.environ.get('SANIC_PORT', 5000)
        self.n_workers = int(os.environ.get('WORKERS', 8))
        self.url_prefix = os.environ.get('URL_PREFIX', '').strip('/')
        if self.url_prefix and not self.url_prefix.startswith('/'):
            self.url_prefix = '/' + self.url_prefix
        self.kbase_endpoint = os.environ.get('KBASE_ENDPOINT', 'https://ci.kbase.us/services').strip('/')
        self.kbase_root = os.environ.get('KBASE_ROOT', 'https://ci.kbase.us').strip('/')
