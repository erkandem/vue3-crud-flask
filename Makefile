
python_builddeps:
	pip install pip-tools

python_requirements:
	pip-compile server/requirements.in -o server/requirements.txt

python_requirements_dev:
	pip-compile server/requirements.dev.in -o server/requirements.dev.txt


python_install_prod:
	make python_builddeps
	pip-sync ./server/requirements.txt

python_install_dev:
	make python_builddeps
	pip-sync ./server/requirements.dev.txt

python_run:
	python server/app.py
