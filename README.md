# Planilhas Gov BR

This project provides automation for processing Brazilian government data spreadsheets (.xls/.xlsx) by converting them to CSV and JSON formats while following data analysis best practices.

## Features

- Converts Excel files to individual CSVs
- Creates consolidated CSV and JSON files
- Normalizes data following best practices
- Handles different Excel file structures
- Logs errors for corrupted files

## Requirements

- Python 3.9+
- pandas
- openpyxl
- xlrd

## Usage

```
python process_spreadsheets.py
```

The script will process all Excel files in the current directory and output individual CSVs to a `converted_csvs` folder, along with consolidated `consolidated_data.csv` and `consolidated_data.json` files.