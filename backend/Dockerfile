# Use official Python image with Alpine (smaller and more efficient)
FROM python:3.13-alpine

# Set working directory inside the container
WORKDIR /app

# Install system dependencies (using Alpine package manager)
RUN apk update \
    && apk add --no-cache gcc libpq-dev \
    && rm -rf /var/cache/apk/*

# Copy the requirements.txt into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files into the container
COPY . .

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the Django app inside the container
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["sh", "-c", "python manage.py migrate && gunicorn cbts.wsgi:application --bind 0.0.0.0:8000"]


