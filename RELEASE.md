# Release Instructions
To release a new version of the extension a new build must be created and uploaded the the Google Chrome Webstore.

1. Update the `manifest.json` version number
2. Run the build script `./build.sh`
3. Go to https://...
4. Update the version by uploading the new zip file


## Example:
#### Update the version number
##### manifest.json
```
{
  ...
  version: "0.3.1"
  ...
}
```

#### Run the build
```
cd ~/Source/GitHub/cda-connect-plus
./build.sh
```
This creates a new zip file in: `./build/cda-connect-plus-0.3.1.zip`

#### Upload the build
* Go to the [Chrome Webstore Developer Dashboard](https://chrome.google.com/webstore/devconsole) and select CDA Connect Plus
* Click the `Upload new package` button
* Upload the zip file created by the build `cda-connect-plus-0.3.1.zip`
* Click the `Submit for review` button to start the Chrome Webstore review process for the new build.