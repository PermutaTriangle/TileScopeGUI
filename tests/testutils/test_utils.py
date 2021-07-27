import os


def is_win():
    return os.name == "nt"


def trim(string: str):
    return string.replace(" ", "").replace("\r", "").replace("\n", "")
