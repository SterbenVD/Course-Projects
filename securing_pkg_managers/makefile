PY_ENV = sec_pkg
PY_ENV_ACTIVATE = $(PY_ENV)/bin/activate
PY_ENV_DEACTIVATE = $(PY_ENV)/bin/deactivate

run:
	. $(PY_ENV_ACTIVATE)
	cd src && streamlit run main.py

install:
	@if [ ! -d "$(PY_ENV)" ]; then python3 -m venv $(PY_ENV); fi
	. $(PY_ENV_ACTIVATE) && pip install -r requirements.txt
	. $(PY_ENV_DEACTIVATE)

activate:
	@if [ ! -d "$(PY_ENV)" ]; then MAKE install; fi
	. $(PY_ENV_ACTIVATE) &

deactivate:
	@if [ -d "$(PY_ENV)" ]; then $(PY_ENV_DEACTIVATE); fi

