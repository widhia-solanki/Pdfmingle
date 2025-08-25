# Use an official, lightweight Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# --- THE FIX: Install system dependencies required by the PDF libraries ---
# This command updates the package list and installs 'mupdf-tools',
# which provides the underlying C libraries that pdf2docx needs to function.
RUN apt-get update && apt-get install -y --no-install-recommends mupdf-tools && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container first, to leverage Docker's layer caching
COPY requirements.txt .

# Install the Python packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend application code into the container
COPY . .

# Make port 10000 available to the world outside this container
EXPOSE 10000

# The command to run your application using Gunicorn (production-ready server)
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
