"""Serve a CRA build like GitHub Pages: missing paths get 404.html with status 404.

Usage: python3 -I serve.py <build_dir> <port>
"""
import functools
import http.server
import os
import sys


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        page = os.path.join(self.directory, '404.html')
        if code == 404 and os.path.isfile(page):
            with open(page, 'rb') as f:
                body = f.read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


if __name__ == '__main__':
    build_dir, port = sys.argv[1], int(sys.argv[2])
    handler = functools.partial(PagesHandler, directory=os.path.abspath(build_dir))
    http.server.ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
