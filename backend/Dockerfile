# Use an official, lightweight Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# --- THE FIX ---
# Install the essential build tools AND the mupdf tools.
# build-essential provides the compilers and libraries that PyMuPDF (a dependency of pdf2docx) needs to run.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    mupdf-tools \
    && rm -rf /var/lib/apt/lists/*

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
