# Base image: lightweight Debian with Python
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install cron
RUN apt-get update && \
    apt-get install -y cron && \
    apt-get install -y wget && \
    apt-get clean

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code (including your script)
COPY . .

CMD ["/usr/local/bin/python", "/app/main.py"]
