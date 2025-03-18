#!/bin/bash

# Configuration
ACR_NAME="devopslearningregistry1"  
IMAGE_VERSION="1.0.0"

# Login to Azure Container Registry
az acr login --name $ACR_NAME

# Set the full registry name
ACR_REGISTRY="${ACR_NAME}.azurecr.io"

# Build and push backend
echo "Building backend image..."
docker build -t $ACR_REGISTRY/note-app-backend:latest -f ./be/Dockerfile.prod ./be

echo "Pushing backend image..."
docker push $ACR_REGISTRY/note-app-backend:latest

# Build and push frontend
echo "Building frontend image..."
docker build -t $ACR_REGISTRY/note-app-frontend:latest -f ./fe/Dockerfile.prod ./fe

echo "Pushing frontend image..."
docker push $ACR_REGISTRY/note-app-frontend:latest

echo "Build and push completed successfully!"