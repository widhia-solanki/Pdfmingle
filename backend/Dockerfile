# Use an official, lightweight Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install build-essential, which is good practice for many Python libraries with C extensions
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container first
COPY requirements.txt .

# Install the Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend application code
COPY . .

# Expose the port
EXPOSE 10000

# The command to run your application
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
