#!/bin/bash
# chmod +x build.sh

# Extract the version number from manifest.json using grep, awk, and sed
version=$(grep '"version":' manifest.json | awk -F':' '{print $2}' | sed 's/[", ]//g')

# Check if the version was extracted correctly
if [ -z "$version" ]; then
    echo "Error reading version from manifest.json"
    exit 1
fi

# Create the build directory if it doesn't exist
if [ ! -d "./build" ]; then
    mkdir ./build
fi

# Create the zip file with the desired name in the build directory
# The -FS option ensures that the zip file is replaced if one exists with the same name
zip -FSr "./build/cda-connect-plus-${version}.zip" * \
    -x "*build*" \
    -x "*.git*" \
    -x "*.sh*" \
    -x "*.DS_Store"

# Check if zip command was successful
if [ $? -ne 0 ]; then
    echo "Error creating zip file"
    exit 1
fi

echo "CDA Connect Plus package created successfully:"
echo "./build/cda-connect-plus-${version}.zip"
