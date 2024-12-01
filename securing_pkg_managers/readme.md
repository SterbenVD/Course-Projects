# AI5063 Course Project

# Simplified AI-Driven Supply Chain Attack Detection System

Develop a basic AI-powered system to detect potential supply chain attacks in software packages, inspired by incidents like the SolarWinds attack. 
The system will analyze software package metadata and contents to identify suspicious modifications.

## Team Structure

- Gautam Singh: CS21BTECH11018
- Vishal Vijay Devadiga: CS21BTECH11061
- Abhay Kumar: BM21BTECH11001

## Stuff done

## Steps to run the project

You will need python installed on your system.

Note that Python 3.13 is not supported by tensorflow at the time of writing this project, so please use a older version of python.

For the libraries, run:

```bash
pip install ./requirements.txt
```

To generate the data, run:

```bash
cd ./src
python data_gen.py
cd ..

```

For running the model, run:

```bash
python model.py
```

For running the server, run:

```bash
cd ./src
streamlit run main.py
cd ..
```

## Project Structure

The project is divided into the following parts in the `src` directory:
- data_gen.py: Generates synthetic data for the project
- model.py: Contains the model for detecting supply chain attacks
- main.py: Contains the server code for the web application
- utils.py: Contains utility functions for the project

## Submission

The project submission consists of the following files:
- `report.md`: Contains the project overview, details, and results
- `report.pdf`: PDF version of the report
- `AI5063 Group 3 Presentation.pdf`: Presentation slides
