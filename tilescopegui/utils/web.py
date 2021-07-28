import threading
import webbrowser


def open_browser_tab(url: str, delay: float) -> None:
    """Open `url` in a webbrowser after `delay` seconds."""
    threading.Timer(delay, lambda: webbrowser.open_new_tab(url)).start()
