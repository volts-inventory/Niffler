# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /web

# Copy requirements file and install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

# Default command to run your script (adjust as needed)
#CMD ["flask", "run", "--host=0.0.0.0"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
