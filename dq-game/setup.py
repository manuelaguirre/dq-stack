from setuptools import setup, find_packages
from glob import glob
from os.path import basename
from os.path import dirname
from os.path import join
from os.path import splitext

setup(
    name="dq-game",
    version="0.1.2",
    description="Defiquizz Client",
    packages=find_packages("src"),
    package_dir={"": "src"},
    py_modules=[splitext(basename(path))[0] for path in glob("src/*.py")],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "pygame"
    ],
)
